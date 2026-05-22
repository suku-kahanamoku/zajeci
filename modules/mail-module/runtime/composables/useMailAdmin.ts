import type {
  IMailTemplate,
  IMailTemplatesResponse,
} from "@/modules/mail-module/runtime/types/mail.types";

export function useMailAdmin() {
  const { t } = useLang();
  const { success, error: toastError } = useToastify();

  const sending = ref<string | null>(null);

  const { data: mailsData, pending: loading } = useAsyncData(
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

  async function sendMail(template: string): Promise<void> {
    sending.value = template;
    try {
      const params = new URLSearchParams({
        template,
        to: "sukusovi@gmail.com",
        subject: "Test email",
        fromEmail: "test@test.cz",
        fromName: "Test",
        fromPhone: "123456789",
      });

      await useApi(`/api/admin/mail/send?${params.toString()}`);
      success(t("$.admin.mail.send_success"));
    } catch {
      toastError(t("$.admin.mail.send_error"));
    } finally {
      sending.value = null;
    }
  }

  return { mails, loading, sending, sendMail };
}
