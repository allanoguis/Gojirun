import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        const { data: games, error } = await supabase
            .from('games')
            .select(`
        player_id,
        player_name,
        score,
        time,
        users (
          profile_image_url,
          email
        )
      `)
            .order('score', { ascending: false })
            .limit(100);

        if (error) throw error;

        const playerScores = new Map();
        games.forEach((game) => {
            const playerId = game.player_id;
            if (!playerScores.has(playerId)) {
                playerScores.set(playerId, {
                    playerId: playerId,
                    playerName: game.player_name,
                    score: game.score,
                    time: game.time,
                    profileImageUrl: game.users?.profile_image_url,
                    email: game.users?.email
                });
            }
        });

        const leaderboard = Array.from(playerScores.values()).slice(0, 10);

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error in getLeaderBoard:', error);
        return NextResponse.json({ message: 'Error in getLeaderBoard' }, { status: 500 });
    }
}
