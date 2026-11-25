import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { GUEST_USER_ID, resolveApplicationIdentity, syncApplicationUser } from '@/lib/application-identity';
import supabaseAdmin from '@/lib/supabase-admin';

export async function POST(request) {
    try {
        const body = await request.json();
        const bodyUserId = typeof body.userId === 'string' ? body.userId.trim() : '';
        if (!bodyUserId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const session = await auth0.getSession();
        if (bodyUserId === GUEST_USER_ID) {
            const { data: existingGuest } = await supabaseAdmin
                .from('users')
                .select('created_at')
                .eq('user_id', GUEST_USER_ID)
                .maybeSingle();

            const { data, error } = await supabaseAdmin
                .from('users')
                .upsert({
                    user_id: GUEST_USER_ID,
                    email: 'guest@example.com',
                    fullname: 'Guest Player',
                    profile_image_url: body.profileImageUrl || null,
                    created_at: existingGuest?.created_at || new Date().toISOString(),
                    last_sign_in_at: new Date().toISOString()
                }, { onConflict: 'user_id' })
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({
                message: 'User saved successfully',
                user: data
            }, { status: data?.user_id ? 201 : 200 });
        }

        if (!session?.user?.sub) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const subject = session.user.sub;
        if (bodyUserId !== GUEST_USER_ID) {
            const applicationUserId = await resolveApplicationIdentity(session.user);
            if (bodyUserId !== subject && bodyUserId !== applicationUserId) {
                return NextResponse.json({ message: 'Unauthorized profile sync' }, { status: 403 });
            }
        }

        const savedUser = await syncApplicationUser(session.user, body);

        return NextResponse.json({ 
            message: 'User saved successfully',
            user: savedUser
        }, {
            status: savedUser?.user_id ? 201 : 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
    } catch (error) {
        console.error('Error in users route:', {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            stack: error?.stack
        });
        return NextResponse.json(
            {
                message: `Error saving user: ${error?.message || 'Unknown error'}`,
                code: error?.code,
                details: error?.details,
                hint: process.env.NODE_ENV === 'development' ? error?.hint : undefined
            },
            { status: 500 }
        );
    }
}
