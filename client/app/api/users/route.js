import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
    try {
        const { userId, email, fullname, profileImageUrl, createdAt, lastSignInAt } = await request.json();

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ message: 'User ' + email + ' already exists' });
        }

        // Insert new user
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    user_id: userId,
                    email: email,
                    fullname: fullname,
                    profile_image_url: profileImageUrl,
                    created_at: createdAt,
                    last_sign_in_at: lastSignInAt
                }
            ]);

        if (insertError) throw insertError;

        return NextResponse.json({ message: 'User ' + fullname + ' created' }, { status: 201 });
    } catch (error) {
        console.error('Error saving user:', error);
        return NextResponse.json({ message: 'Error saving user' }, { status: 500 });
    }
}
