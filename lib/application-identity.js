import supabaseAdmin from './supabase-admin.js';

const GUEST_USER_ID = '000000';

export function isVerifiedEmail(sessionUser) {
  return sessionUser?.email_verified === true || sessionUser?.email_verified === 'true';
}

export function isValidDate(value) {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(
    typeof value === 'number'
      ? (value < 1000000000000 ? value * 1000 : value)
      : value
  );
  return !Number.isNaN(date.getTime());
}

export function toIsoDate(value) {
  if (!isValidDate(value)) return null;
  const date = value instanceof Date ? value : new Date(
    typeof value === 'number'
      ? (value < 1000000000000 ? value * 1000 : value)
      : value
  );
  return date.toISOString();
}

export async function resolveApplicationIdentity(sessionUser) {
  const subject = sessionUser?.sub;
  if (!subject) return null;

  const { data: existingLink, error: linkError } = await supabaseAdmin
    .from('auth_identity_links')
    .select('app_user_id')
    .eq('auth0_subject', subject)
    .maybeSingle();

  if (linkError) throw linkError;
  if (existingLink?.app_user_id) {
    await backfillAuth0Games(subject, existingLink.app_user_id);
    return existingLink.app_user_id;
  }

  const email = typeof sessionUser.email === 'string' ? sessionUser.email.trim().toLowerCase() : '';
  if (email && isVerifiedEmail(sessionUser)) {
    const { data: matches, error: matchError } = await supabaseAdmin
      .from('users')
      .select('user_id,email')
      .ilike('email', email)
      .limit(2);

    if (matchError) throw matchError;
    if (matches?.length === 1) {
      const appUserId = matches[0].user_id;
      const { error: insertError } = await supabaseAdmin
        .from('auth_identity_links')
        .upsert({
          auth0_subject: subject,
          app_user_id: appUserId,
          email,
          linked_at: new Date().toISOString()
        }, { onConflict: 'auth0_subject' });

      if (insertError) throw insertError;
      await backfillAuth0Games(subject, appUserId);
      return appUserId;
    }
  }

  return subject;
}

export async function backfillAuth0Games(subject, appUserId) {
  if (!subject || !appUserId || subject === appUserId) return;

  const { error } = await supabaseAdmin
    .from('games')
    .update({ user_id: appUserId })
    .eq('user_id', subject);

  if (error) throw error;
}

export async function getSessionApplicationIdentity(auth0) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) return null;
  return resolveApplicationIdentity(session.user);
}

export function getAuthenticationTimestamp(sessionUser) {
  const claimCandidates = [
    sessionUser?.auth_time,
    sessionUser?.last_login,
    sessionUser?.last_sign_in_at,
    sessionUser?.iat
  ];

  for (const value of claimCandidates) {
    const iso = toIsoDate(value);
    if (iso) return iso;
  }
  return new Date().toISOString();
}

export function getAccountCreationTimestamp(sessionUser) {
  return toIsoDate(sessionUser?.created_at) || new Date().toISOString();
}

export async function syncApplicationUser(sessionUser, profile = {}) {
  const appUserId = await resolveApplicationIdentity(sessionUser);
  if (!appUserId) return null;
  await backfillAuth0Games(sessionUser.sub, appUserId);

  const email = isVerifiedEmail(sessionUser) && typeof sessionUser.email === 'string'
    ? sessionUser.email.trim().toLowerCase()
    : null;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('users')
    .select('created_at')
    .eq('user_id', appUserId)
    .maybeSingle();

  if (existingError) throw existingError;

  const now = new Date().toISOString();
  const insertedCreatedAt = getAccountCreationTimestamp(sessionUser);
  const createdAt = toIsoDate(existing?.created_at) || insertedCreatedAt || now;
  const lastSignInAt = getAuthenticationTimestamp(sessionUser);

  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert({
      user_id: appUserId,
      email: email || profile.email || 'unknown@example.com',
      fullname: profile.fullname || sessionUser.given_name || sessionUser.nickname || sessionUser.name || 'User',
      profile_image_url: profile.profileImageUrl || sessionUser.picture || null,
      created_at: createdAt,
      last_sign_in_at: lastSignInAt
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export { GUEST_USER_ID };
