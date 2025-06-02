import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // If user is authenticated, redirect to home
  if (user && token) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#F9FAFB',
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
        }}
      />
    </Stack>
  );
} 