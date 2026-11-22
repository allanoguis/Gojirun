import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase-admin';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId: bodyUserId } = body;
        const { userId: authedUserId } = await auth();

        // Security Check: Only allow syncing if it's the Guest ID or the Authed User's ID
        if (bodyUserId !== '000000' && bodyUserId !== authedUserId) {
            return NextResponse.json({ message: 'Unauthorized profile sync' }, { status: 403 });
        }

        const { data, error } = await supabaseAdmin
            .from('users')
            .upsert({
                user_id: body.userId,
                email: body.email,
                fullname: body.fullname,
                profile_image_url: body.profileImageUrl,
                created_at: body.createdAt,
                last_sign_in_at: body.lastSignInAt
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        const savedUser = data;

        return NextResponse.json({ 
            message: 'User saved successfully',
            user: savedUser
        }, {
            status: savedUser?.user_id ? 201 : 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
    } catch (error) {
        console.error('Error in users route:', {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            stack: error?.stack
        });
        return NextResponse.json(
            {
                message: `Error saving user: ${error?.message || 'Unknown error'}`,
                code: error?.code,
                details: error?.details,
                hint: error?.hint
            },
            { status: 500 }
        );
    }
}
