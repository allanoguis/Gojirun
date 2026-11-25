import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { GameService } from '@/lib/api-services';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('playerId') || searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (userId !== '000000') {
        const session = await auth0.getSession();
        const authedUserId = session?.user?.sub;
        if (!authedUserId) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }
        if (userId !== authedUserId) {
            return NextResponse.json({ message: 'Unauthorized profile access' }, { status: 403 });
        }
    }

    try {
        const pastTenGames = await GameService.getPastTenGames(userId);
        return NextResponse.json({ pastTenGames });
    } catch (error) {
        console.error('Error getting past ten games:', error);
        return NextResponse.json({ message: 'Error getting past ten games' }, { status: 500 });
    }
}
