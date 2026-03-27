# Profile Completion Feature

This feature ensures that all users provide mandatory demographic data before accessing the full dashboard and tutorial.

## Changes Made

### 1. User Interface
-   **ProfileCompletionModal**: A new component that forces users to complete their profile after signup or login if data is missing.
-   **Dashboard Integration**: The `DashboardLayout` now checks for `user.profile_completed`. If false, it displays the completion modal and suppresses the tutorial.
-   **Support for Dynamic Fields**: Collected fields include:
    -   Full Name
    -   Age
    -   Gender (Male/Female/Other)
    -   Caste
    -   Religion
    -   Father's Name
    -   Area of Residence
    -   Mobile Number (with mandatory simulated verification)

### 2. Mandatory Mobile Verification
-   The user must enter a 6-digit verification code.
-   For development purposes, the OTP is logged to the browser console and shown in an alert.
-   The profile is only marked as `profile_completed=true` after successful verification.

### 3. Backend & Type Updates
-   **User Type**: Updated `User` interface to include the new fields.
-   **Auth Service**: 
    -   Added `updateProfile` method.
    -   Updated `login` and `getUserData` to fetch the new fields from the `users` table.

## Necessary Backend (Supabase) Changes

To ensure this works perfectly, you must run the following SQL in your Supabase SQL Editor:

> [!IMPORTANT]
> If you see an error saying **"Could not find the 'age' column"**, it means you haven't run this SQL yet.

```sql
-- 1. Add new columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS caste TEXT,
ADD COLUMN IF NOT EXISTS religion TEXT,
ADD COLUMN IF NOT EXISTS fathers_name TEXT,
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_pic TEXT,
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- 2. (Optional) Migrate existing profiles
UPDATE profiles SET profile_completed = FALSE WHERE profile_completed IS NULL;

-- 3. Ensure Row Level Security (RLS) allows users to update their own profile
-- This is critical to avoid "403 Forbidden" errors.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## How it works
1.  User logs in.
2.  `DashboardLayout` detects `!user.profile_completed`.
3.  `ProfileCompletionModal` appears (modal, cannot be closed).
4.  User fills out the form.
5.  User verifies mobile number.
6.  `authService.updateProfile` is called.
7.  Global auth state is updated, modal disappears, and `DashboardTutorial` starts.
