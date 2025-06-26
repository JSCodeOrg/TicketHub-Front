import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
      <Stack.Screen name="verify-screen" />
    </Stack>
  );
}