import type { IFormConfig } from "@suku-kahanamoku/form-module/types";
import type {
  IMailTemplate,
  IMailTemplatesResponse,
} from "@/modules/mail-module/runtime/types/mail.types";

export function useMailAdmin(cfg?: IFormConfig) {
  const { t } = useLang();
  const { success, error: toastError } = useToastify();
  const { onSubmit } = useFormNavigable();

  const loading = ref(false);
  const isDialogOpen = ref(false);
  const selectedTemplate = ref<string | null>(null);

  const config = computed<IFormConfig | undefined>(() => cfg);

  const { data: mailsData, pending: listLoading } = useAsyncData(
    "admin-mail-list",
    async () => {
      try {
        return (await useApi("/api/admin/mail")) as IMailTemplatesResponse;
      } catch {
        return {} as IMailTemplatesResponse;
      }
    },
  );

  const mails = computed<IMailTemplate[]>(
    () => (mailsData.value?.data as IMailTemplate[] | undefined) ?? [],
  );

  function openSendDialog(template: string): void {
    selectedTemplate.value = template;
    isDialogOpen.value = true;
  }

  async function onSend(body: Record<string, any>): Promise<void> {
    loading.value = true;
    try {
      const result = await onSubmit(config.value!, {
        ...body,
        template: selectedTemplate.value,
      });
      if (result?.data !== undefined) {
        success(t("$.admin.mail.send_success"));
        isDialogOpen.value = false;
      }
    } catch {
      toastError(t("$.admin.mail.send_error"));
    } finally {
      loading.value = false;
    }
  }

  return {
    config,
    mails,
    loading,
    listLoading,
    isDialogOpen,
    selectedTemplate,
    openSendDialog,
    onSend,
  };
}
