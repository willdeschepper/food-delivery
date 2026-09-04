import { router } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CartSummary } from '@/components/cart-summary';
import { OfflineBanner } from '@/components/offline-banner';
import { PrimaryButton } from '@/components/primary-button';
import { Screen } from '@/components/screen';
import { calculateCartTotals } from '@/src/domain/cart';
import type { DeliveryAddress, PaymentMethod } from '@/src/domain/models';
import { useDeliveryStore } from '@/src/state/delivery-store';
import { colors } from '@/src/theme/colors';
import { formatCurrency } from '@/src/utils/format';

const addresses: DeliveryAddress[] = [
  { label: 'Casa', street: 'Rua das Flores, 120', complement: 'Apto. 32 · Centro, Jacareí' },
  { label: 'Trabalho', street: 'Av. das Nações, 850', complement: 'Recepção · São José dos Campos' },
];

export default function CheckoutScreen() {
  const [addressIndex, setAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const cart = useDeliveryStore(state => state.cart);
  const online = useDeliveryStore(state => state.online);
  const placeOrder = useDeliveryStore(state => state.placeOrder);
  const totals = calculateCartTotals(cart);

  const submit = () => {
    if (cart.length === 0) return router.replace('/');
    const order = placeOrder(addresses[addressIndex], paymentMethod);
    router.replace(`/order/${order.id}`);
  };

  return (
    <Screen edges="header">
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!online ? (
          <View style={styles.offlineNotice}>
            <Text style={styles.offlineTitle}>Você pode finalizar sem internet</Text>
            <Text style={styles.offlineText}>
              O pedido será salvo no aparelho e enviado automaticamente quando a conexão voltar.
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>ENDEREÇO DE ENTREGA</Text>
        <View style={styles.group}>
          {addresses.map((address, index) => (
            <Pressable
              key={address.label}
              onPress={() => setAddressIndex(index)}
              style={[styles.option, addressIndex === index && styles.optionSelected]}
            >
              <View style={[styles.optionIcon, addressIndex === index && styles.optionIconSelected]}>
                <Text style={[styles.optionIconText, addressIndex === index && styles.optionIconTextSelected]}>
                  {index === 0 ? '⌂' : '⌖'}
                </Text>
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{address.label}</Text>
                <Text style={styles.optionText}>{address.street}</Text>
                <Text style={styles.optionText}>{address.complement}</Text>
              </View>
              <View style={[styles.radio, addressIndex === index && styles.radioSelected]}>
                {addressIndex === index ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>PAGAMENTO</Text>
        <View style={styles.group}>
          <PaymentOption
            active={paymentMethod === 'card'}
            detail="Final •••• 4821"
            icon={<Text style={[styles.optionIconText, paymentMethod === 'card' && styles.optionIconTextSelected]}>▰</Text>}
            label="Cartão de crédito"
            onPress={() => setPaymentMethod('card')}
          />
          <PaymentOption
            active={paymentMethod === 'pix'}
            detail="Código gerado após confirmar"
            icon={<Text style={[styles.optionIconText, paymentMethod === 'pix' && styles.optionIconTextSelected]}>◇</Text>}
            label="Pix"
            onPress={() => setPaymentMethod('pix')}
          />
        </View>

        <Text style={styles.sectionLabel}>VALORES</Text>
        <View style={styles.summaryCard}>
          <CartSummary totals={totals} />
        </View>

        <View style={styles.secureRow}>
          <Text style={styles.secureIcon}>✓</Text>
          <Text style={styles.secureText}>Pagamento protegido e pedido salvo com segurança.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          disabled={cart.length === 0}
          label={`${online ? 'Confirmar pedido' : 'Salvar e enviar depois'} · ${formatCurrency(totals.total)}`}
          onPress={submit}
          testID="place-order"
        />
      </View>
    </Screen>
  );
}

function PaymentOption({
  active,
  detail,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  detail: string;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.option, active && styles.optionSelected]}>
      <View style={[styles.optionIcon, active && styles.optionIconSelected]}>{icon}</View>
      <View style={styles.optionCopy}>
        <Text style={styles.optionTitle}>{label}</Text>
        <Text style={styles.optionText}>{detail}</Text>
      </View>
      <View style={[styles.radio, active && styles.radioSelected]}>
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 122 },
  sectionLabel: { marginTop: 8, marginBottom: 9, color: colors.textMuted, fontWeight: '600', fontSize: 10, letterSpacing: 1.1 },
  group: { overflow: 'hidden', borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  option: { minHeight: 88, padding: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  optionSelected: { backgroundColor: '#FFFBF8' },
  optionIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  optionIconSelected: { backgroundColor: colors.primarySoft },
  optionIconText: { color: colors.textMuted, fontSize: 23, fontWeight: '600' },
  optionIconTextSelected: { color: colors.primary },
  optionCopy: { flex: 1, marginLeft: 12 },
  optionTitle: { color: colors.text, fontWeight: '600', fontSize: 14 },
  optionText: { color: colors.textMuted, fontWeight: '400', fontSize: 11, lineHeight: 17 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  summaryCard: { borderRadius: 24, padding: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  offlineNotice: { marginBottom: 14, borderRadius: 20, padding: 17, backgroundColor: colors.warningSoft },
  offlineTitle: { color: colors.warning, fontWeight: '600', fontSize: 14 },
  offlineText: { marginTop: 4, color: colors.warning, fontWeight: '400', fontSize: 11, lineHeight: 17 },
  secureRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  secureIcon: { color: colors.success, fontSize: 18, fontWeight: '700' },
  secureText: { color: colors.textMuted, fontWeight: '400', fontSize: 10 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, backgroundColor: colors.background },
});
