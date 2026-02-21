// Avatar Display Test Script
// Test to verify Clerk avatar URLs are properly handled

// Test data simulating what should come from database
const testPlayerData = {
  // Case 1: Clerk user with avatar URL
  clerkUser: {
    playerId: 'user_clerk_123',
    playerName: 'John Doe',
    score: 25000,
    time: 45.2,
    profileImageUrl: 'https://images.clerk.dev/accounts/avatar_abc123.png',
    email: 'john@example.com'
  },
  
  // Case 2: User without avatar (should fall back to DiceBear)
  userWithoutAvatar: {
    playerId: 'user_no_avatar',
    playerName: 'Jane Smith',
    score: 18000,
    time: 52.8,
    profileImageUrl: null,
    email: 'jane@example.com'
  },
  
  // Case 3: Guest user
  guestUser: {
    playerId: '000000',
    playerName: 'Guest',
    score: 5000,
    time: 75.3,
    profileImageUrl: null,
    email: 'guest@gojirun.local'
  }
};

// Function to generate avatar URL (same as in components)
function getAvatarUrl(player) {
  return player.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.playerName || 'Guest'}`;
}

// Test cases
console.log('=== Avatar URL Generation Test ===\n');

console.log('1. Clerk User with Avatar:');
console.log('Input:', testPlayerData.clerkUser);
console.log('Generated URL:', getAvatarUrl(testPlayerData.clerkUser));
console.log('Expected: Should use Clerk avatar URL\n');

console.log('2. User without Avatar:');
console.log('Input:', testPlayerData.userWithoutAvatar);
console.log('Generated URL:', getAvatarUrl(testPlayerData.userWithoutAvatar));
console.log('Expected: Should use DiceBear fallback\n');

console.log('3. Guest User:');
console.log('Input:', testPlayerData.guestUser);
console.log('Generated URL:', getAvatarUrl(testPlayerData.guestUser));
console.log('Expected: Should use DiceBear fallback\n');

// Test database field mapping
console.log('=== Database Field Mapping Test ===\n');

// Simulate database response (snake_case)
const dbResponse = {
  player_id: 'user_clerk_123',
  player_name: 'John Doe',
  score: 25000,
  time: 45.2,
  users: {
    profile_image_url: 'https://images.clerk.dev/accounts/avatar_abc123.png',
    email: 'john@example.com'
  }
};

// API response mapping (camelCase)
const apiResponse = {
  playerId: dbResponse.player_id,
  playerName: dbResponse.player_name,
  score: dbResponse.score,
  time: dbResponse.time,
  profileImageUrl: dbResponse.users?.profile_image_url || dbResponse.users?.profileImageUrl,
  email: dbResponse.users?.email
};

console.log('Database Response:', dbResponse);
console.log('API Response:', apiResponse);
console.log('Avatar URL:', getAvatarUrl(apiResponse));
console.log('Expected: Should work correctly\n');

console.log('=== Troubleshooting Checklist ===');
console.log('1. Check if Clerk user.imageUrl is being saved to database');
console.log('2. Verify profile_image_url field exists in users table');
console.log('3. Test with actual Clerk authentication');
console.log('4. Check browser network requests for avatar URLs');
console.log('5. Verify Image component error handling');
