import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // 1. Fetch User Info
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (userError && userError.code !== 'PGRST116') throw userError;

        // 2. Fetch High Score
        const { data: topGame, error: scoreError } = await supabase
            .from('games')
            .select('score')
            .eq('player_id', userId)
            .order('score', { ascending: false })
            .limit(1)
            .single();

        if (scoreError && scoreError.code !== 'PGRST116') throw scoreError;

        // 3. Fetch Past 10 Games
        const { data: pastGames, error: gamesError } = await supabase
            .from('games')
            .select('*')
            .eq('player_id', userId)
            .order('time', { ascending: false })
            .limit(10);

        if (gamesError) throw gamesError;

        return NextResponse.json({
            user: user || null,
            highScore: topGame ? topGame.score : 0,
            pastGames: pastGames || []
        });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return NextResponse.json({ message: 'Error fetching profile data' }, { status: 500 });
    }
}
