import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { testMessage = 'Test broadcast' } = body;

        // Call the Edge Function for broadcasting
        const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/broadcast-highscore`;
        
        const broadcastPayload = {
            user_id: '000000',
            score: 9999,
            metadata: {
                player_name: 'DebugTest',
                testMessage: testMessage,
                created_at: new Date().toISOString()
            }
        };

        const broadcastResponse = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify(broadcastPayload)
        });

        if (broadcastResponse.ok) {
            const result = await broadcastResponse.json();
        return NextResponse.json({
            success: true,
            message: 'Test broadcast sent via Edge Function',
            payload: broadcastPayload,
            edgeFunctionResult: result,
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        } else {
            const error = await broadcastResponse.text();
            return NextResponse.json({
                success: false,
                error: 'Edge Function broadcast failed',
                details: error
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Test broadcast error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
