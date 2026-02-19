import supabase from "../supabaseClient.js";

export const userController = async (req, res) => {
  const { userId, email, fullname, profileImageUrl, createdAt, lastSignInAt } = req.body;

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(200).json({ message: "User " + email + " already exists" });
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

    res.status(201).json({ message: "User " + fullname + " created" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user" });
  }
};
