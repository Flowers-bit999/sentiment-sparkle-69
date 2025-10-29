-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

-- Create restricted policy: users can view their own profile and profiles of product/review authors
CREATE POLICY "Users can view relevant profiles" ON profiles
FOR SELECT
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM products WHERE user_id = profiles.id
  ) OR
  EXISTS (
    SELECT 1 FROM reviews WHERE user_id = profiles.id
  )
);