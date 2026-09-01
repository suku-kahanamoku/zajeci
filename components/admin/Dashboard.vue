<script setup lang="ts">
import dashboardConfig from "@/assets/configs/dashboard.json";

interface DashboardResponse {
  data?: Record<string, any>[];
  meta?: { total?: number };
}

const { t, locale } = useLang();
const localePath = useLocalePath();
const { user } = useUserSession();

async function loadSource(url: string): Promise<DashboardResponse> {
  try {
    return (await useApi(url)) as DashboardResponse;
  } catch {
    return {};
  }
}

const { data: stats, pending } = useAsyncData("admin-dashboard-stats", async () => {
  const [wines, orders, users] = await Promise.all([
    loadSource(dashboardConfig.sources.wines),
    loadSource(dashboardConfig.sources.orders),
    loadSource(dashboardConfig.sources.users),
  ]);
  const total = (response: DashboardResponse) =>
    Number(response.meta?.total ?? response.data?.length ?? 0);

  return {
    wines: total(wines),
    orders: total(orders),
    users: total(users),
    recentWines: wines.data ?? [],
    recentOrders: orders.data ?? [],
  };
});

const cards = computed(() => [
  {
    label: t("$.admin.quick.wines"),
    value: stats.value?.wines ?? 0,
    to: "/admin/wine",
    icon: "i-heroicons-beaker",
    accent: "from-primary-500/15 to-primary-300/5",
    iconClass: "bg-primary text-white shadow-primary/25",
  },
  {
    label: t("$.admin.quick.orders"),
    value: stats.value?.orders ?? 0,
    to: "/admin/order",
    icon: "i-heroicons-shopping-bag",
    accent: "from-secondary-500/15 to-secondary-300/5",
    iconClass: "bg-secondary text-white shadow-secondary/25",
  },
  {
    label: t("$.admin.quick.users"),
    value: stats.value?.users ?? 0,
    to: "/admin/user",
    icon: "i-heroicons-users",
    accent: "from-cyan-500/15 to-sky-300/5",
    iconClass: "bg-cyan-600 text-white shadow-cyan-600/25",
  },
]);

const userName = computed(
  () => user.value?.first_name || t("$.dashboard.administrator"),
);

function money(value: unknown, currency = "CZK"): string {
  return new Intl.NumberFormat(locale.value === "en" ? "en-GB" : "cs-CZ", {
    style: "currency",
    currency,
  }).format(Number(value ?? 0));
}

function orderCustomer(order: Record<string, any>): string {
  const name = [order.user?.first_name, order.user?.last_name]
    .filter(Boolean)
    .join(" ");
  return name || order.user?.email || t("$.dashboard.customer");
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl space-y-6 px-5 pb-12 pt-6 sm:px-7">
    <section class="crm-hero-panel p-7 sm:p-9">
      <div class="relative z-10 max-w-3xl">
        <p
          class="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-blue-100"
        >
          {{ t("$.dashboard.eyebrow") }}
        </p>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-5xl">
          {{ t("$.dashboard.greeting", { name: userName }) }}
        </h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-blue-50/85 sm:text-lg">
          {{ t("$.dashboard.description") }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <UButton
            :to="localePath('/admin/wine/create')"
            color="secondary"
            size="lg"
            icon="i-heroicons-plus"
          >
            {{ t("$.dashboard.new_wine") }}
          </UButton>
          <UButton
            :to="localePath('/admin/order')"
            color="neutral"
            variant="soft"
            size="lg"
            trailing-icon="i-heroicons-arrow-right"
          >
            {{ t("$.dashboard.browse_orders") }}
          </UButton>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <NuxtLink
        v-for="card in cards"
        :key="card.to"
        :to="localePath(card.to)"
        class="group relative overflow-hidden rounded-2xl border border-default/80 bg-default/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div :class="card.accent" class="absolute inset-0 bg-gradient-to-br opacity-80" />
        <div class="relative flex items-start justify-between">
          <span
            :class="card.iconClass"
            class="grid size-12 place-items-center rounded-2xl shadow-lg"
          >
            <UIcon :name="card.icon" class="size-6" />
          </span>
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="size-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>
        <USkeleton v-if="pending" class="relative mt-8 h-10 w-24" />
        <p
          v-else
          class="relative mt-8 text-4xl font-extrabold tracking-tight text-highlighted"
        >
          {{ card.value }}
        </p>
        <p class="relative mt-1 font-bold text-muted">{{ card.label }}</p>
      </NuxtLink>
    </section>

    <section class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <UCard class="overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="crm-eyebrow">{{ t("$.dashboard.recent_activity") }}</p>
              <h2 class="text-xl font-extrabold">
                {{ t("$.dashboard.recent_orders") }}
              </h2>
            </div>
            <UButton
              :to="localePath('/admin/order')"
              color="neutral"
              variant="ghost"
              trailing-icon="i-heroicons-arrow-right"
            >
              {{ t("$.dashboard.all_orders") }}
            </UButton>
          </div>
        </template>

        <div v-if="stats?.recentOrders.length" class="divide-y divide-default">
          <NuxtLink
            v-for="order in stats.recentOrders"
            :key="order.id"
            :to="localePath(`/admin/order/${order.id}`)"
            class="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
          >
            <span
              class="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"
            >
              <UIcon name="i-heroicons-shopping-bag" class="size-5" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-bold">
                {{ order.order_number || `#${order.id}` }}
              </span>
              <span class="block truncate text-sm text-muted">
                {{ orderCustomer(order) }}
              </span>
            </span>
            <span class="whitespace-nowrap text-sm font-extrabold text-primary">
              {{ money(order.total_price, order.currency || "CZK") }}
            </span>
          </NuxtLink>
        </div>
        <p v-else class="py-6 text-center text-muted">
          {{ t("$.dashboard.no_orders") }}
        </p>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <p class="crm-eyebrow">{{ t("$.dashboard.cellar") }}</p>
            <h2 class="text-xl font-extrabold">
              {{ t("$.dashboard.latest_wines") }}
            </h2>
          </div>
        </template>

        <div v-if="stats?.recentWines.length" class="space-y-3">
          <NuxtLink
            v-for="wine in stats.recentWines"
            :key="wine.id"
            :to="localePath(`/admin/wine/${wine.id}`)"
            class="flex items-center gap-3 rounded-xl border border-default p-3 transition hover:border-primary hover:bg-primary/5"
          >
            <span
              class="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary"
            >
              <UIcon name="i-heroicons-beaker" class="size-5" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-bold">{{ wine.name }}</span>
              <span class="text-xs text-muted">
                {{ t("$.dashboard.stock", { count: wine.stock_quantity ?? 0 }) }}
              </span>
            </span>
            <span class="whitespace-nowrap text-sm font-extrabold text-primary">
              {{ money(wine.price) }}
            </span>
          </NuxtLink>
        </div>
        <p v-else class="py-6 text-center text-muted">
          {{ t("$.dashboard.no_wines") }}
        </p>
      </UCard>
    </section>
  </div>
</template>
