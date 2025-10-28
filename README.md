# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Eshop Module Composables

Cashdesk logic has been split into dedicated singletons:

- `useCashdesk` – orchestrates user, cart, submit flow and aggregates totals.
- `useCart` – manages cart items & subtotal (add/remove/update). LocalStorage persistence still triggered from `useCashdesk` wrapper methods.
- `useDelivery` – handles delivery method state & options (free shipping threshold logic based on cart subtotal).
- `usePayment` – handles payment method state & options (same threshold logic for potential future payment fees).

Each composable is a manual singleton (cached inside module scope) to persist reactive state similarly to a store without adding a dependency.

If you previously called `setDelivery` / `setPayment` from `useCashdesk`, the API remains compatible: those methods now delegate to the new composables.
