import { useUrlResolver, useFormNavigable } from "#imports";

import type { IFormConfig } from "@suku-kahanamoku/form-module/types";
import { CLONE } from "@suku-kahanamoku/common-module/utils";

import type { IWine, IWineResponse, IWinesResponse } from "../types";

export function useTasteAdmin(wConfig: any) {
  const { t } = useLang();
  const { routes, route } = useMenuItems();
  const { success, error: toastError } = useToastify();
  const { onSubmit, navigate, onPageChange, onFilterChange } =
    useFormNavigable();
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
    { watch: [() => route.query] },
  );

  const {
    data: tastes,
    pending: loading,
    refresh,
  } = useAsyncData(
    () => (config.value?.syscode || "") + "data",
    async () => {
      if (config?.value?.restUrl) {
        try {
          let url = useCompleteUrl(config.value?.restUrl, {
            config: config.value,
            route,
          });
          url = useFactory(url, config.value.factory, routes.admin_taste?.path);
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
    },
  );

  async function onDelete(value: boolean) {
    if (value && config.value?.deleteUrl && selected.value?.length) {
      const method = "DELETE";
      try {
        if (selected.value.length > 1) {
          await Promise.all(
            selected.value.map((item) => {
              const url = useUrl(config.value!.deleteUrl!, {
                config: config.value!,
                route,
                item,
              });
              return useApi(url, { method });
            }),
          );
        } else {
          const url = useUrl(config.value!.deleteUrl!, {
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

  async function onUpdate(body: Record<string, any>, taste: IWine) {
    loading.value = true;
    const result = await onSubmit(config?.value!, body, taste);
    if (result?.data) {
      document
        .querySelectorAll(".field-warning")
        .forEach((el) => el.classList.remove("field-warning"));
      navigateTo(routes.admin_taste?.path);
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
      navigateTo(routes.admin_taste?.path);
    }
    loading.value = false;
  }

  function handleSort(sort: Record<string, number>[]) {
    if (!config.value?.syscode) return;
    (config.value as any).sort = sort;
    navigate(config.value as any);
  }

  function handlePage(page: number) {
    onPageChange(config.value as any, page);
  }

  function handleFilter(data: Record<string, string>) {
    onFilterChange(config.value as any, data);
  }

  return {
    config,
    tastes,
    meta: computed(() => tastes.value?.meta),
    loading,
    selected,
    isOpen,
    refresh,
    onDelete,
    onUpdate,
    onCreate,
    handleSort,
    handlePage,
    handleFilter,
  };
}
