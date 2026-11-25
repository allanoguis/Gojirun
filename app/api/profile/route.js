import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { GameService } from '../../../lib/api-services';
import { getSessionApplicationIdentity, GUEST_USER_ID } from '@/lib/application-identity';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    let resolvedUserId;
    if (userId === GUEST_USER_ID) {
        resolvedUserId = GUEST_USER_ID;
    } else {
        const session = await auth0.getSession();
        resolvedUserId = await getSessionApplicationIdentity(auth0);
        if (!resolvedUserId || !session?.user?.sub) {
            return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
        }
        if (userId !== session.user.sub && userId !== resolvedUserId) {
            return NextResponse.json({ message: 'Unauthorized profile access' }, { status: 403 });
        }
    }

    try {
        const profileData = await GameService.getProfileData(resolvedUserId);
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
