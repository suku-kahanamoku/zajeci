import type { TableColumn } from "@nuxt/ui";

import type { IFormConfig } from "@/modules/form-module/runtime/types";
import { CLONE } from "@suku-kahanamoku/common-module/utils";

import type { IOrder, IOrderResponse, IOrdersResponse } from "../types";

export function useOrderAdmin(wConfig: any) {
  const { t } = useLang();
  const { routes, route } = useMenuItems();
  const toast = useToast();
  const { onSubmit } = useFormNavigable();
  const { updateConfig } = useUrlResolver();

  const selected = ref<IOrder[]>([]);
  const isOpen = ref(false);

  // Columns
  const columns: Ref<TableColumn<any>[]> = computed(
    () =>
      config?.value?.fields?.map((f) => ({
        accessorKey: f.name,
        header: t(f.label!),
      })) ?? []
  );

  const { data: config } = useAsyncData(
    () => (wConfig?.syscode || "") + "config",
    async () => {
      try {
        const result = CLONE(wConfig);
        updateConfig(route, result);
        return result as IFormConfig;
      } catch (error: any) {
        return {} as IFormConfig;
      }
    },
    { watch: [() => route.query] }
  );

  // Orders
  const {
    data: orders,
    pending: loading,
    refresh,
  } = useAsyncData(
    () => (config.value?.syscode || "") + "data" + route.fullPath,
    async () => {
      if (config?.value?.restUrl) {
        try {
          let url = useCompleteUrl(config.value?.restUrl, {
            config: config.value,
            route,
          });
          url = useFactory(url, config.value.factory, routes.admin_order.path);
          return (await useApi(url)) as IOrderResponse | IOrdersResponse;
        } catch (error: any) {
          console.error(error);
          return {};
        }
      }
      return {};
    },
    {
      watch: [config],
      immediate: true,
    }
  );

  // Delete
  async function onDelete(value: boolean) {
    if (value && config?.value?.deleteUrl && selected.value?.length) {
      const method = "DELETE";
      try {
        let url = useUrl(config.value.deleteUrl, {
          config: config.value,
          route,
          item: selected.value,
        });
        await useApi(url, { method });
        toast.add({
          title: t("$.form.delete_success_msg"),
          color: "success",
          icon: "i-heroicons-check",
        });
      } catch (error: any) {
        toast.add({
          title: error.data.message,
          color: "error",
          icon: "i-heroicons-exclamation-circle",
        });
      }
      selected.value = [];
      isOpen.value = false;
      await refresh();
    }
  }

  async function onUpdate(body: Record<string, any>, order: IOrder) {
    loading.value = true;
    const result = await onSubmit(config?.value!, body, order);
    if (result?.data) {
      document
        .querySelectorAll(".field-warning")
        .forEach((el) => el.classList.remove("field-warning"));
      navigateTo(routes.admin_order.path);
    }
    loading.value = false;
  }

  return {
    config,
    columns,
    orders,
    loading,
    selected,
    isOpen,
    refresh,
    onDelete,
    onUpdate,
  };
}
