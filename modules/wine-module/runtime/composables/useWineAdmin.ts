import type { TableColumn } from "@nuxt/ui";
import { useUrlResolver, useFormNavigable } from "#imports";

import type { IFormConfig } from "@suku-kahanamoku/form-module/types";
import { CLONE } from "@suku-kahanamoku/common-module/utils";

import type { IWine, IWineResponse, IWinesResponse } from "../types";

export function useWineAdmin(wConfig: any) {
  const { t } = useLang();
  const { routes, route } = useMenuItems();
  const toast = useToast();
  const { onSubmit } = useFormNavigable();
  const { updateConfig } = useUrlResolver();

  const selected = ref<IWine[]>([]);
  const isOpen = ref(false);

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

  // Wines
  const {
    data: wines,
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
          url = useFactory(url, config.value.factory, routes.admin_wine.path);
          return (await useApi(url)) as IWineResponse | IWinesResponse;
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
    if (value && config.value?.deleteUrl && selected.value?.length) {
      const method = "DELETE";
      try {
        if (selected.value.length > 1) {
          // Mazání více záznamů přes Promise.all
          await Promise.all(
            selected.value.map((item) => {
              const url = useUrl(config.value!.deleteUrl!, {
                config: config.value!,
                route,
                item,
              });
              return useApi(url, { method });
            })
          );
        } else {
          // Mazání jednoho záznamu
          let url = useUrl(config.value!.deleteUrl!, {
            config: config.value!,
            route,
            item: selected.value[0],
          });
          await useApi(url, { method });
        }
        toast.add({
          title: t("$.form.delete_success_msg"),
          color: "success",
          icon: "i-heroicons-check",
        });
      } catch (error: any) {
        toast.add({
          title: error.data?.message || error.message,
          color: "error",
          icon: "i-heroicons-exclamation-circle",
        });
      }
      selected.value = [];
      isOpen.value = false;
      await refresh();
    }
  }

  async function onUpdate(body: Record<string, any>, wine: IWine) {
    loading.value = true;
    const result = await onSubmit(config?.value!, body, wine);
    if (result?.data) {
      document
        .querySelectorAll(".field-warning")
        .forEach((el) => el.classList.remove("field-warning"));
      navigateTo(routes.admin_wine.path);
    }
    loading.value = false;
  }

  async function onCreate(body: Record<string, any>) {
    loading.value = true;
    const result = await onSubmit(config?.value!, body);
    if (result?.data) {
      document
        .querySelectorAll(".field-warning")
        .forEach((el) => el.classList.remove("field-warning"));
      navigateTo(routes.admin_wine.path);
    }
    loading.value = false;
  }

  return {
    config,
    wines,
    loading,
    selected,
    isOpen,
    refresh,
    onDelete,
    onUpdate,
    onCreate,
  };
}
