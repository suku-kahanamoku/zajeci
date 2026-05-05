import type { IEnumItem, IEnumResponse, IEnumsResponse } from "@/types/enum.types";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { useUrlResolver, useFormNavigable } from "#imports";

export function useEnumAdmin(eConfig: any) {
  const { t } = useLang();
  const { routes, route } = useMenuItems();
  const { success, error: toastError } = useToastify();
  const { onSubmit } = useFormNavigable();
  const { updateConfig } = useUrlResolver();

  const selected = ref<IEnumItem[]>([]);
  const isOpen = ref(false);

  const { data: config } = useAsyncData(
    () => (eConfig?.syscode || "") + "config",
    async () => {
      try {
        const result = CLONE(eConfig);
        updateConfig(route, result);
        return result as IFormConfig;
      } catch (error: any) {
        return {} as IFormConfig;
      }
    },
    { watch: [() => route.query] }
  );

  // Enums
  const {
    data: enums,
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
          url = useFactory(url, config.value.factory, routes.admin_enum?.path);
          return (await useApi(url)) as IEnumResponse | IEnumsResponse;
        } catch (error: any) {
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
        success(t("$.form.delete_success_msg"));
      } catch (error: any) {
        toastError(error);
      }
      selected.value = [];
      isOpen.value = false;
      await refresh();
    }
  }

  async function onUpdate(body: Record<string, any>, enumItem: IEnum) {
    loading.value = true;
    const result = await onSubmit(config?.value!, body, enumItem);
    if (result?.data) {
      document
        .querySelectorAll(".field-warning")
        .forEach((el) => el.classList.remove("field-warning"));
      navigateTo(routes.admin_enum?.path);
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
      navigateTo(routes.admin_enum?.path);
    }
    loading.value = false;
  }

  return {
    config,
    enums,
    loading,
    selected,
    isOpen,
    refresh,
    onDelete,
    onUpdate,
    onCreate,
  };
}
