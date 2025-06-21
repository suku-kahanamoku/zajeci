import type { TableColumn } from "@nuxt/ui";

import type { IFormConfig } from "~/modules/form-module/runtime/types";
import { CLONE } from "~/modules/common-module/runtime/utils";

import type { IWine, IWineResponse, IWinesResponse } from "../types";

export function useWine(wConfig: any) {
  const { t } = useLang();
  const { routes, route } = useMenuItems();
  const { updateConfig } = useUrlResolver();

  const selected = ref<IWine[]>([]);
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

  // Wines
  const {
    data: wines,
    pending,
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
          url = useFactory(url, config.value.factory, route.path);
          return (await useApi(url)) as IWineResponse | IWinesResponse;
        } catch (error: any) {
          console.error(error);
          return {};
        }
      }
    },
    {
      watch: [config],
    }
  );

  return {
    config,
    columns,
    wines,
    pending,
    selected,
    isOpen,
    refresh,
  };
}
