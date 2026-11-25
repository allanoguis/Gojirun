import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import supabaseAdmin from '@/lib/supabase-admin';
import { getSupabaseUrl, getSupabaseServiceRoleKey } from '@/lib/env';
import { getSessionApplicationIdentity, GUEST_USER_ID } from '@/lib/application-identity';

export async function POST(request) {
    try {
        const body = await request.json();
        const { player, playerName, score, time, userAgent } = body;
        const applicationUserId = player === GUEST_USER_ID
            ? GUEST_USER_ID
            : await getSessionApplicationIdentity(auth0);

        // Input validation
        if (!player || !playerName || score === undefined) {
            return NextResponse.json({ message: 'Missing required fields: player, playerName, score' }, { status: 400 });
        }

        if (typeof score !== 'number' || score < 0) {
            return NextResponse.json({ message: 'Score must be a non-negative number' }, { status: 400 });
        }

        // Security Check: If a real player ID is provided, it must match the active session.
        // Guest players (000000) are allowed without session matching.
        if (player !== GUEST_USER_ID) {
            if (!applicationUserId) {
                return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
            }
            const session = await auth0.getSession();
            if (player !== session?.user?.sub && player !== applicationUserId) {
                return NextResponse.json({ message: 'Unauthorized session mismatch' }, { status: 403 });
            }
        }
        const resolvedPlayerId = applicationUserId;
        if (!resolvedPlayerId) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        // Insert game record
        const { data, error } = await supabaseAdmin
            .from('games')
            .insert([
                {
                    user_id: resolvedPlayerId,
                    player_name: playerName,
                    score: score,
                    user_agent: userAgent || 'Unknown',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        const savedGame = data;
        console.log('Game saved successfully:', { player, score });

        // Fire-and-forget broadcast (don't fail save if broadcast fails)
        const supabaseUrl = getSupabaseUrl();
        const serviceKey = getSupabaseServiceRoleKey();
        
        if (supabaseUrl && serviceKey) {
            fetch(`${supabaseUrl}/functions/v1/broadcast-highscore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceKey}`
                },
                body: JSON.stringify({
                    user_id: resolvedPlayerId,
                    score: score,
                    metadata: { player_name: playerName, created_at: new Date().toISOString() }
                })
            }).catch(err => console.error('[savegame] Broadcast failed (non-critical):', err.message));
        }

        return NextResponse.json({ 
            message: 'Game saved successfully', 
            id: savedGame.id,
            saved: {
                player: savedGame.user_id,
                playerName: savedGame.player_name,
                score: savedGame.score,
                createdAt: savedGame.created_at
            }
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error in savegame route:', error.message);
        return NextResponse.json(
            { message: `Error saving game: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
