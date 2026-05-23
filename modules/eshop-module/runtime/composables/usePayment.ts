import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IEnumItem } from "@/modules/enum-module/runtime/types/enum.types";

export function usePayment() {
  const { totalPrice } = useCart();

  const payment = useState<IEnumItem>(
    "selected-payment",
    () => ({}) as IEnumItem,
  );

  const { data: enumPayments } = useAsyncData("payment-enums", async () => {
    try {
      const r = await useApi(
        '/api/enumerations?q={"type":{"value":"payment"}}&limit=50&sort=[{"position":1}]',
      );
      return r?.data ?? [];
    } catch {
      return [];
    }
  });

  const paymentOptions = computed<IEnumItem[]>(() =>
    (enumPayments.value ?? [])
      .filter((e) => e.published)
      .map(
        (e): IEnumItem => ({
          ...e,
          data: {
            ...e.data,
            price: totalPrice.value > 2500 ? 0 : (e.data?.price ?? 0),
          },
        }),
      ),
  );

  function setPayment(newPayment?: IEnumItem | null) {
    const fallback =
      paymentOptions.value.find((p) => !p.data?.disabled) ??
      paymentOptions.value[0];
    payment.value = CLONE(newPayment || fallback || ({} as IEnumItem));
  }

  // Nastav výchozí platbu jakmile jsou načteny options
  watch(
    paymentOptions,
    (opts) => {
      if (opts.length && !payment.value.value) {
        setPayment();
      }
    },
    { immediate: true },
  );

  return {
    payment,
    paymentOptions,
    setPayment,
  };
}

export type UsePaymentReturn = ReturnType<typeof usePayment>;
