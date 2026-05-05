import type {
  IAdminUser,
  IUserResponse,
  IUsersResponse,
} from "@/types/user.types";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { useUrlResolver, useFormNavigable } from "#imports";

export function useUserAdmin(uConfig: any) {
  const { t } = useLang();
  const { routes, route } = useMenuItems();
  const { success, error: toastError } = useToastify();
  const { onSubmit } = useFormNavigable();
  const { updateConfig } = useUrlResolver();

  const selected = ref<IAdminUser[]>([]);
  const isOpen = ref(false);

  const { data: config } = useAsyncData(
    () => (uConfig?.syscode || "") + "config",
    async () => {
      try {
        const result = CLONE(uConfig);
        updateConfig(route, result);
        return result as IFormConfig;
      } catch (error: any) {
        return {} as IFormConfig;
      }
    },
    { watch: [() => route.query] }
  );

  const {
    data: users,
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
          url = useFactory(url, config.value.factory, routes.admin_user?.path);
          return (await useApi(url)) as IUserResponse | IUsersResponse;
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
            })
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

  async function onUpdate(body: Record<string, any>, user: IAdminUser) {
    loading.value = true;
    const result = await onSubmit(config?.value!, body, user);
    if (result?.data) {
      document
        .querySelectorAll(".field-warning")
        .forEach((el) => el.classList.remove("field-warning"));
      navigateTo(routes.admin_user?.path);
    }
    loading.value = false;
  }

  return {
    config,
    users,
    loading,
    selected,
    isOpen,
    refresh,
    onDelete,
    onUpdate,
  };
}
