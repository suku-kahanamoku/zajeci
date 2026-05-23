import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { type IShipping } from "@/modules/eshop-module/runtime/types/order.interface";

export function useShipping() {
  const { totalPrice } = useCart();

  const shipping = useState<IShipping>(
    "selected-shipping",
    () => ({}) as IShipping,
  );

  const { data: enumShipping } = useAsyncData("shipping-enums", async () => {
    try {
      const r = await useApi(
        '/api/enumerations?q={"type":{"value":"shipping"}}&limit=50&sort=[{"position":1}]',
      );
      return r?.data ?? [];
    } catch {
      return [];
    }
  });

  const shippingOptions = computed<IShipping[]>(() =>
    (enumShipping.value ?? [])
      .filter((e) => e.published)
      .map((e) => ({
        label: e.label,
        price: totalPrice.value > 2500 ? 0 : (e.data?.price ?? 0),
        icon: e.data?.icon,
        help: e.data?.help,
        disabled: e.data?.disabled ?? false,
        value: e.value ?? e.syscode,
      })),
  );

  function setShipping(newShipping?: IShipping | null) {
    const fallback =
      shippingOptions.value.find((p) => !p.disabled) ??
      shippingOptions.value[0];
    const base = CLONE(newShipping || fallback || ({} as IShipping));
    base.price =
      totalPrice.value > 2500
        ? 0
        : (shippingOptions.value.find((s) => s.value === base.value)?.price ??
          base.price ??
          0);
    base.key = (shipping.value.key || 0) + 1;
    shipping.value = base;
  }

  watch(
    shippingOptions,
    (opts) => {
      if (opts.length && !shipping.value.value) {
        setShipping();
      } else if (opts.length && shipping.value.value) {
        // Aktualizovat plný objekt (cena, label) pro již uloženou hodnotu
        setShipping(opts.find((s) => s.value === shipping.value.value));
      }
    },
    { immediate: true },
  );

  return {
    shipping,
    shippingOptions,
    setShipping,
  };
}

export type UseShippingReturn = ReturnType<typeof useShipping>;
