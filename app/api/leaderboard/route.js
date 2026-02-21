import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

export const dynamic = 'force-dynamic';

// Data is from Supabase (GameService.getLeaderboard). Same list on local + production only if both use the same SUPABASE_URL.
export async function GET() {
    try {
        const leaderboard = await GameService.getLeaderboard();
        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error in leaderboard route:', error);
        return NextResponse.json({ message: 'Error retrieving leaderboard' }, { status: 500 });
    }
}
