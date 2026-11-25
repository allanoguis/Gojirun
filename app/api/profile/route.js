import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { GameService } from '../../../lib/api-services';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // For signed-in users, verify auth
    if (userId !== '000000') {
        const session = await auth0.getSession();
        const authedUserId = session?.user?.sub;

        try {
            if (!authedUserId) {
                return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
            }
            
            if (userId !== authedUserId) {
                return NextResponse.json({ message: 'Unauthorized profile access' }, { status: 403 });
            }
        } catch (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({ message: 'Authentication error' }, { status: 500 });
        }
    }

    try {
        const profileData = await GameService.getProfileData(userId);
        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Error message:', error?.message);
        console.error('Error name:', error?.name);
        console.error('Error code:', error?.code);
        return NextResponse.json({ 
            message: 'Error fetching profile data', 
            error: process.env.NODE_ENV === 'development' ? error?.message : undefined
        }, { status: 500 });
    }
}
