<script setup lang="ts">
definePageMeta({
  layout: "admin",
  syscode: "admin",
  title: "$.admin.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

// Counts for dashboard cards
const ordersCount = ref<number | string>("—");
const invoicesCount = ref<number | string>("—");
const usersCount = ref<number | string>("—");
const winesCount = ref<number | string>("—");

function extractCount(res: any) {
  if (!res) return 0;
  if (res.meta && typeof res.meta.total === "number") return res.meta.total;
  if (Array.isArray(res.data)) return res.data.length;
  if (res.data && typeof res.data.total === "number") return res.data.total;
  return 0;
}

// Load counts (safe, non-blocking)
useAsyncData("admin.counts", async () => {
  try {
    const [o, i, u, w] = await Promise.all([
      useApi("/api/admin/order?limit=1"),
      useApi("/api/admin/invoice?limit=1"),
      useApi("/api/admin/user?limit=1"),
      useApi("/api/admin/wine?limit=1"),
    ]);
    ordersCount.value = extractCount(o) || 0;
    invoicesCount.value = extractCount(i) || 0;
    usersCount.value = extractCount(u) || 0;
    winesCount.value = extractCount(w) || 0;
  } catch (err) {
    ordersCount.value = 0;
    invoicesCount.value = 0;
    usersCount.value = 0;
    winesCount.value = 0;
  }
});

// Recent activity (latest orders)
const { data: recentOrders } = await useAsyncData(
  "admin.recent.orders",
  async () => {
    try {
      const r = await useApi("/api/admin/order?limit=5");
      return r?.data || [];
    } catch {
      return [];
    }
  },
  { immediate: true },
);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-5 py-8">
    <div :id="routes.admin?.meta?.syscode as string">
      <UPageHeader
        :title="title"
        :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
        class="border-none"
      />

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UCard class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-muted">{$.admin.quick.orders}</div>
              <div class="text-2xl font-semibold">{{ ordersCount }}</div>
            </div>
            <UButton
              :to="routes.admin?.children?.order?.path"
              icon="i-heroicons-shopping-bag"
              variant="ghost"
            />
          </div>
        </UCard>

        <UCard class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-muted">{$.admin.quick.invoices}</div>
              <div class="text-2xl font-semibold">{{ invoicesCount }}</div>
            </div>
            <UButton
              :to="routes.admin?.children?.invoice?.path"
              icon="i-heroicons-document-text"
              variant="ghost"
            />
          </div>
        </UCard>

        <UCard class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-muted">{$.admin.quick.users}</div>
              <div class="text-2xl font-semibold">{{ usersCount }}</div>
            </div>
            <UButton
              :to="routes.admin?.children?.user?.path"
              icon="i-heroicons-users"
              variant="ghost"
            />
          </div>
        </UCard>

        <UCard class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-muted">{$.admin.quick.wines}</div>
              <div class="text-2xl font-semibold">{{ winesCount }}</div>
            </div>
            <UButton
              :to="routes.admin?.children?.wine?.path"
              icon="i-heroicons-beaker"
              variant="ghost"
            />
          </div>
        </UCard>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UCard>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">{$.admin.quick.title}</h3>
            <p class="text-muted">{$.admin.quick.description}</p>
          </div>
        </UCard>

        <UCard>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">
              {$.admin.recent.title || 'Recent activity'}
            </h3>
            <div class="space-y-3">
              <div
                v-if="!recentOrders || !recentOrders.length"
                class="text-muted"
              >
                No recent orders
              </div>
              <div v-else>
                <ul class="space-y-2">
                  <li
                    v-for="(o, idx) in recentOrders"
                    :key="idx"
                    class="flex justify-between items-center"
                  >
                    <div>
                      <div class="font-medium">
                        {{
                          o.order_number ||
                          "Order #" + (o.id || o.order_id || "")
                        }}
                      </div>
                      <div class="text-sm text-muted">
                        {{ o.user?.email || o.user?.first_name || "" }}
                      </div>
                    </div>
                    <div class="text-sm text-muted">
                      {{ o.total_price ? o.total_price + " " + $.czk : "" }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <div class="mt-8">
        <UCard>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Quick links</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <UButton to="/admin/order" variant="outline" class="justify-start"
                >Administrace objednávek</UButton
              >
              <UButton
                to="/admin/invoice"
                variant="outline"
                class="justify-start"
                >Správa faktur</UButton
              >
              <UButton to="/admin/user" variant="outline" class="justify-start"
                >Správa uživatelů</UButton
              >
              <UButton to="/admin/wine" variant="outline" class="justify-start"
                >Administrace vín</UButton
              >
              <UButton
                to="/admin/category"
                variant="outline"
                class="justify-start"
                >Správa kategorií</UButton
              >
              <UButton to="/admin/mail" variant="outline" class="justify-start"
                >Správa e-mailů</UButton
              >
              <UButton to="/admin/enum" variant="outline" class="justify-start"
                >Správa enumerátorů</UButton
              >
              <UButton
                to="/admin/payment"
                variant="outline"
                class="justify-start"
                >Správa platebních metod</UButton
              >
              <UButton
                to="/admin/shipping"
                variant="outline"
                class="justify-start"
                >Správa dopravních metod</UButton
              >
              <UButton
                to="/admin/address"
                variant="outline"
                class="justify-start"
                >Správa adres</UButton
              >
              <UButton to="/admin/role" variant="outline" class="justify-start"
                >Správa rolí</UButton
              >
              <UButton to="/admin/text" variant="outline" class="justify-start"
                >Správa textů</UButton
              >
              <UButton to="/admin/taste" variant="outline" class="justify-start"
                >Degustace</UButton
              >
              <UButton
                to="/admin/vat-rate"
                variant="outline"
                class="justify-start"
                >Správa sazby DPH</UButton
              >
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
