import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
    try {
        const { player, playerName, time, score, ipAddress, deviceType, userAgent } = await request.json();

        const { data, error } = await supabase
            .from('games')
            .insert([
                {
                    player_id: player,
                    player_name: playerName,
                    time: time,
                    score: score,
                    ip_address: ipAddress,
                    device_type: deviceType,
                    user_agent: userAgent,
                    created_at: new Date()
                }
            ])
            .select();

        if (error) throw error;

        return NextResponse.json({ message: 'Game saved successfully', id: data[0].id }, { status: 201 });
    } catch (error) {
        console.error('Error saving game:', error);
        return NextResponse.json({ message: 'Error saving game' }, { status: 500 });
    }
}
