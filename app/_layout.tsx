import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/src/providers/app-provider';
import { colors } from '@/src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '600' },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ title: 'Seu carrinho' }} />
          <Stack.Screen name="checkout" options={{ title: 'Finalizar pedido' }} />
          <Stack.Screen name="order/[orderId]" options={{ title: 'Acompanhar pedido' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
