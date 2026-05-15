import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { type IPayment } from "@/modules/eshop-module/runtime/types/order.interface";

let _paymentSingleton: ReturnType<typeof createPayment> | null = null;

function createPayment() {
  const { totalPrice } = useCart();

  const payment = ref<IPayment>({} as IPayment);

  const { data: enumPayments } = useAsyncData("payment-enums", async () => {
    try {
      const r = await $fetch<{ data: any[] }>(
        '/api/enumerations?q={"type":{"value":"payment"}}&limit=50&sort=[{"position":1}]',
      );
      return r.data ?? [];
    } catch {
      return [];
    }
  });

  const paymentOptions = computed<IPayment[]>(() =>
    (enumPayments.value ?? [])
      .filter((e) => e.published)
      .map((e) => ({
        label:    e.label,
        price:    totalPrice.value > 2500 ? 0 : (e.data?.price ?? 0),
        icon:     e.data?.icon,
        disabled: e.data?.disabled ?? false,
        value:    e.value ?? e.syscode,
      })),
  );

  function setPayment(newPayment?: IPayment | null) {
    const fallback =
      paymentOptions.value.find((p) => !p.disabled) ?? paymentOptions.value[0];
    payment.value = CLONE(
      newPayment || fallback || ({} as IPayment),
    );
  }

  // Nastav výchozí platbu jakmile jsou načteny options
  watch(
    paymentOptions,
    (opts) => {
      if (opts.length && !payment.value.type) {
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

export function usePayment() {
  if (_paymentSingleton) return _paymentSingleton;
  _paymentSingleton = createPayment();
  return _paymentSingleton;
}

export type UsePaymentReturn = ReturnType<typeof usePayment>;
