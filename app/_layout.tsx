import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
