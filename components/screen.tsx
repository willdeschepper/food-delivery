import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

type ScreenProps = PropsWithChildren<{
  style?: ViewStyle;
  edges?: 'all' | 'header';
}>;

export function Screen({ children, style, edges = 'all' }: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges === 'header' ? ['right', 'bottom', 'left'] : ['top', 'right', 'bottom', 'left']}
      style={styles.safe}
    >
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
});
