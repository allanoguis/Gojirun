import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !anonKey) {
            return NextResponse.json({
                success: false,
                error: 'Supabase environment variables not found',
                url: url ? 'found' : 'missing',
                anonKey: anonKey ? 'found' : 'missing'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            url: url,
            anonKey: anonKey
        }, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
