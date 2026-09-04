import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { OfflineBanner } from '@/components/offline-banner';
import { ProductCard } from '@/components/product-card';
import { Screen } from '@/components/screen';
import { categories, fetchMenu } from '@/src/data/menu';
import { countCartItems } from '@/src/domain/cart';
import type { MenuCategory } from '@/src/domain/models';
import { useDeliveryStore } from '@/src/state/delivery-store';
import { colors } from '@/src/theme/colors';
import { formatCurrency } from '@/src/utils/format';

type CategoryFilter = 'Todos' | MenuCategory;

export default function HomeScreen() {
  const [category, setCategory] = useState<CategoryFilter>('Todos');
  const [search, setSearch] = useState('');
  const cart = useDeliveryStore(state => state.cart);
  const addToCart = useDeliveryStore(state => state.addToCart);
  const latestOrder = useDeliveryStore(state => state.orders[0]);
  const itemCount = countCartItems(cart);
  const total = cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  const menuQuery = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
    networkMode: 'always',
  });
  const filteredMenu = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    return (menuQuery.data ?? []).filter(item => {
      const matchesCategory = category === 'Todos' || item.category === category;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${item.name} ${item.description}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [category, menuQuery.data, search]);

  return (
    <Screen>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.eyebrow}>ENTREGAR EM</Text>
            <Pressable style={styles.locationRow}>
              <Text style={styles.locationIcon}>⌖</Text>
              <Text style={styles.location}>Casa · Jacareí</Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityLabel="Abrir carrinho"
            onPress={() => router.push('/cart')}
            style={styles.cartButton}
          >
            <Text style={styles.cartIcon}>🛍</Text>
            {itemCount > 0 ? <Text style={styles.cartBadge}>{itemCount}</Text> : null}
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>CHEGOU QUENTINHO</Text>
            <Text style={styles.heroTitle}>Seu burger favorito, sem complicação.</Text>
            <View style={styles.heroMeta}>
              <View style={styles.rating}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.ratingText}>4,9</Text>
              </View>
              <Text style={styles.heroDetail}>25–35 min</Text>
              <Text style={styles.heroDetail}>Entrega grátis acima de R$ 50</Text>
            </View>
          </View>
          <Text style={styles.heroEmoji}>🍔</Text>
        </View>

        {latestOrder && latestOrder.status !== 'delivered' ? (
          <Pressable
            onPress={() => router.push(`/order/${latestOrder.id}`)}
            style={styles.activeOrder}
          >
            <View>
              <Text style={styles.activeOrderLabel}>PEDIDO EM ANDAMENTO</Text>
              <Text style={styles.activeOrderTitle}>Acompanhe o pedido {latestOrder.id}</Text>
            </View>
            <Text style={styles.activeOrderArrow}>›</Text>
          </Pressable>
        ) : null}

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel="Buscar no cardápio"
            onChangeText={setSearch}
            placeholder="Buscar no cardápio"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={search}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.categories}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(item => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.category, category === item && styles.categoryActive]}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Cardápio</Text>
            <Text style={styles.sectionSubtitle}>Feito na hora para você</Text>
          </View>
          <Text style={styles.resultCount}>{filteredMenu.length} itens</Text>
        </View>

        {menuQuery.isPending ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Montando o cardápio…</Text>
          </View>
        ) : menuQuery.isError ? (
          <View style={styles.loading}>
            <Text style={styles.sectionTitle}>Não foi possível carregar</Text>
            <Pressable onPress={() => void menuQuery.refetch()}>
              <Text style={styles.retry}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : filteredMenu.length === 0 ? (
          <View style={styles.loading}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.sectionTitle}>Nenhum item encontrado</Text>
            <Text style={styles.loadingText}>Tente outro nome ou categoria.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.productList}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filteredMenu.map(item => (
              <ProductCard item={item} key={item.id} onAdd={addToCart} />
            ))}
          </ScrollView>
        )}
      </ScrollView>

      {itemCount > 0 ? (
        <View style={styles.cartDock}>
          <Pressable onPress={() => router.push('/cart')} style={styles.cartDockButton}>
            <View style={styles.cartDockCount}>
              <Text style={styles.cartDockCountText}>{itemCount}</Text>
            </View>
            <Text style={styles.cartDockLabel}>Ver carrinho</Text>
            <Text style={styles.cartDockTotal}>{formatCurrency(total)}</Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 118 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18 },
  eyebrow: { color: colors.primary, fontWeight: '600', fontSize: 10, letterSpacing: 1.1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  locationIcon: { color: colors.primary, fontSize: 19, fontWeight: '700' },
  location: { color: colors.text, fontWeight: '600', fontSize: 15 },
  chevron: { color: colors.textMuted, fontSize: 18, fontWeight: '600' },
  cartButton: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cartBadge: { position: 'absolute', right: -4, top: -5, minWidth: 21, height: 21, borderRadius: 11, backgroundColor: colors.primary, color: colors.white, textAlign: 'center', fontWeight: '600', fontSize: 11, lineHeight: 21 },
  cartIcon: { fontSize: 20 },
  hero: { marginHorizontal: 20, padding: 22, minHeight: 202, borderRadius: 30, backgroundColor: colors.text, overflow: 'hidden', flexDirection: 'row' },
  heroCopy: { flex: 1, zIndex: 1 },
  heroKicker: { color: '#FFB58E', fontWeight: '600', fontSize: 10, letterSpacing: 1.4 },
  heroTitle: { maxWidth: 230, marginTop: 8, color: colors.white, fontWeight: '700', fontSize: 25, lineHeight: 32 },
  heroMeta: { marginTop: 17, gap: 5 },
  rating: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  star: { color: colors.warning, fontSize: 15 },
  ratingText: { color: colors.white, fontWeight: '600', fontSize: 12 },
  heroDetail: { color: '#D8CBC3', fontWeight: '400', fontSize: 11 },
  heroEmoji: { position: 'absolute', right: -17, bottom: -8, fontSize: 110, transform: [{ rotate: '-8deg' }] },
  activeOrder: { marginHorizontal: 20, marginTop: 14, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: colors.successSoft, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeOrderLabel: { color: colors.success, fontWeight: '600', fontSize: 9, letterSpacing: 1 },
  activeOrderTitle: { color: colors.text, fontWeight: '500', fontSize: 13 },
  activeOrderArrow: { color: colors.success, fontSize: 30, lineHeight: 30 },
  searchBox: { marginHorizontal: 20, marginTop: 18, height: 54, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  searchInput: { flex: 1, color: colors.text, fontWeight: '400', fontSize: 14 },
  searchIcon: { color: colors.textMuted, fontSize: 25, lineHeight: 27 },
  categories: { paddingHorizontal: 20, paddingVertical: 17, gap: 9 },
  category: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 15, paddingVertical: 10 },
  categoryActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { color: colors.textMuted, fontWeight: '500', fontSize: 12 },
  categoryTextActive: { color: colors.white },
  sectionHeader: { paddingHorizontal: 20, marginTop: 4, marginBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 22 },
  sectionSubtitle: { color: colors.textMuted, fontWeight: '400', fontSize: 12 },
  resultCount: { color: colors.textMuted, fontWeight: '500', fontSize: 11 },
  loading: { minHeight: 260, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 10 },
  loadingText: { color: colors.textMuted, fontWeight: '400', fontSize: 13 },
  retry: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  emptyEmoji: { fontSize: 40 },
  productList: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  cartDock: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, backgroundColor: 'rgba(255,248,242,0.96)' },
  cartDockButton: { minHeight: 60, borderRadius: 20, paddingHorizontal: 14, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center' },
  cartDockCount: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  cartDockCountText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  cartDockLabel: { flex: 1, marginLeft: 12, color: colors.white, fontWeight: '600', fontSize: 15 },
  cartDockTotal: { color: colors.white, fontWeight: '600', fontSize: 14 },
});
