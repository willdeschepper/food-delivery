# Food Delivery

Aplicativo mobile de delivery construído com Expo e React Native, com jornada
completa de cardápio, carrinho, checkout e acompanhamento do pedido. O fluxo
continua funcionando em conectividade instável: carrinho e pedidos ficam
persistidos no aparelho, e pedidos pendentes são sincronizados quando a rede
volta.

## Destaques

- Cardápio com busca, categorias, loading, erro e estado vazio.
- Carrinho com quantidades, regras de taxa e entrega grátis.
- Checkout com endereço e forma de pagamento.
- Rastreamento visual do pedido em cinco estados.
- Pedidos offline persistidos antes da sincronização.
- Identidade idempotente preservada em novas tentativas.
- Sincronização automática ao recuperar conexão ou reabrir o app.
- Interface acessível e preparada para Android e iOS.
- Testes de domínio e validação contínua no GitHub Actions.

## Jornada

```text
Cardápio → Carrinho → Checkout → Pedido confirmado → Preparo → Entrega
                              ↘ Sem rede: pedido pendente → Sincronização
```

O projeto inclui dados locais para permitir que toda a experiência seja
executada imediatamente. Na tela de acompanhamento, a ação identificada como
`DEMONSTRAÇÃO` avança o status para visualizar cada etapa da entrega.

## Arquitetura

| Área | Implementação |
| --- | --- |
| Plataforma | Expo 57, React Native 0.86 e React 19 |
| Navegação | Expo Router com Stack e rotas tipadas |
| Server state | TanStack Query |
| Estado da jornada | Zustand |
| Persistência | Expo SQLite Key-Value Store |
| Conectividade | NetInfo + lifecycle do aplicativo |
| Interface | StyleSheet, tipografia nativa e tokens visuais |
| Qualidade | TypeScript, ESLint, Vitest e GitHub Actions |

### Organização do código

```text
app/                    telas e navegação
components/             componentes reutilizáveis de interface
src/data/               catálogo e fonte de dados
src/domain/             regras puras de carrinho e pedido
src/providers/          React Query, rede e sincronização
src/state/              estado persistido da jornada
src/theme/              tokens visuais
src/utils/              formatação compartilhada
```

As regras de preço e criação de pedido ficam fora das telas. Isso permite testar
cálculos, transições e identidade da operação sem depender do runtime nativo.

## Operação offline

Ao finalizar sem conexão, o aplicativo:

1. cria o pedido com uma chave idempotente;
2. persiste carrinho, totais e endereço no SQLite;
3. mostra o estado `queued` para o usuário;
4. detecta a recuperação da rede pelo NetInfo;
5. sincroniza preservando a identidade original da operação.

Em uma integração com backend, a API deve armazenar e respeitar a chave
idempotente para que novas tentativas não criem pedidos duplicados.

## Executando

Requisitos:

- Node.js 22+
- npm 10+
- Expo Go, simulador ou emulador

```bash
git clone https://github.com/willdeschepper/food-delivery.git
cd food-delivery
npm install
npm start
```

Atalhos disponíveis:

```bash
npm run ios
npm run android
npm run web
```

## Qualidade

```bash
npm run lint
npm run type-check
npm test
npm run check
```

Os testes cobrem:

- incremento e remoção de itens;
- cálculo de subtotal, taxas e entrega grátis;
- criação de pedido online e offline;
- preservação da chave idempotente durante a sincronização.

## Licença

MIT — consulte [`LICENSE`](LICENSE).
