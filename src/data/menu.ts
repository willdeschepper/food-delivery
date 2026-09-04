import type { MenuCategory, MenuItem } from '@/src/domain/models';

export const categories: ('Todos' | MenuCategory)[] = [
  'Todos',
  'Combos',
  'Hambúrgueres',
  'Acompanhamentos',
  'Bebidas',
];

export const menu: MenuItem[] = [
  {
    id: 'smash-duplo',
    name: 'Smash Duplo',
    description: 'Dois burgers, queijo, cebola caramelizada e molho da casa.',
    category: 'Hambúrgueres',
    price: 32.9,
    emoji: '🍔',
    accent: '#FFE0B2',
    popular: true,
  },
  {
    id: 'combo-casa',
    name: 'Combo da Casa',
    description: 'Smash clássico, batata crocante e refrigerante gelado.',
    category: 'Combos',
    price: 44.9,
    emoji: '🥤',
    accent: '#FFD6C8',
    popular: true,
  },
  {
    id: 'crispy-chicken',
    name: 'Crispy Chicken',
    description: 'Frango crocante, coleslaw fresco e maionese de páprica.',
    category: 'Hambúrgueres',
    price: 29.9,
    emoji: '🍗',
    accent: '#FFF0BE',
  },
  {
    id: 'veggie-grill',
    name: 'Veggie Grill',
    description: 'Burger vegetal, queijo, tomate, rúcula e molho verde.',
    category: 'Hambúrgueres',
    price: 28.9,
    emoji: '🥬',
    accent: '#DFF1D8',
  },
  {
    id: 'batata-paprica',
    name: 'Batata Páprica',
    description: 'Batatas crocantes com páprica defumada e aioli.',
    category: 'Acompanhamentos',
    price: 15.9,
    emoji: '🍟',
    accent: '#FFE7A9',
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados com molho barbecue.',
    category: 'Acompanhamentos',
    price: 17.9,
    emoji: '🧅',
    accent: '#F2DEC8',
  },
  {
    id: 'soda-limao',
    name: 'Soda de Limão',
    description: 'Limão, água com gás e hortelã. 400 ml.',
    category: 'Bebidas',
    price: 9.9,
    emoji: '🍋',
    accent: '#E7F2BD',
  },
];

export async function fetchMenu(): Promise<MenuItem[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return menu;
}
