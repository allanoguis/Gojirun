import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const { data: pastTenGames, error } = await supabase
            .from('games')
            .select('*')
            .eq('player_id', userId)
            .order('time', { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({ pastTenGames });
    } catch (error) {
        console.error('Error getting past ten games:', error);
        return NextResponse.json({ message: 'Error getting past ten games' }, { status: 500 });
    }
}
