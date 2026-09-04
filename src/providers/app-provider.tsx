import NetInfo from '@react-native-community/netinfo';
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useDeliveryStore } from '@/src/state/delivery-store';

function isOnline(isConnected: boolean | null, isInternetReachable: boolean | null): boolean {
  return isConnected !== false && isInternetReachable !== false;
}

function ConnectivityBridge() {
  const setOnline = useDeliveryStore(state => state.setOnline);
  const synchronize = useDeliveryStore(state => state.synchronize);
  const online = useDeliveryStore(state => state.online);
  const hydrated = useDeliveryStore(state => state.hydrated);

  useEffect(() => {
    return NetInfo.addEventListener(network => {
      const connected = isOnline(network.isConnected, network.isInternetReachable);
      onlineManager.setOnline(connected);
      setOnline(connected);

    });
  }, [setOnline]);

  useEffect(() => {
    if (online && hydrated) synchronize();
  }, [hydrated, online, synchronize]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (status === 'active') void NetInfo.refresh();
    });

    return () => subscription.remove();
  }, []);

  return null;
}

export function AppProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5 * 60 * 1000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectivityBridge />
      {children}
    </QueryClientProvider>
  );
}
