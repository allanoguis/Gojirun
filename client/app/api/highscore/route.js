import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
        return NextResponse.json({ message: 'Player ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('player_id', playerId)
            .order('score', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!data) {
            return NextResponse.json({ message: 'No games found for the specified player' }, { status: 404 });
        }

        const topGame = {
            id: data.id,
            ...data,
            player: data.player_id,
            playerName: data.player_name,
            time: data.time,
            score: data.score
        };

        return NextResponse.json({ topGame });
    } catch (error) {
        console.error('Error retrieving high score:', error);
        return NextResponse.json({ message: 'Error retrieving high score for player' }, { status: 500 });
    }
}
