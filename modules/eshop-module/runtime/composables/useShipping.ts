import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { type IShipping } from "@/modules/eshop-module/runtime/types/order.interface";

let _shippingSingleton: ReturnType<typeof createShipping> | null = null;

function createShipping() {
  const { totalPrice } = useCart();

  const shipping = ref<IShipping>({} as IShipping);

  const { data: enumShipping } = useAsyncData("shipping-enums", async () => {
    try {
      const r = await $fetch<{ data: any[] }>(
        '/api/enumerations?q={"type":{"value":"shipping"}}&limit=50&sort=[{"position":1}]',
      );
      return r.data ?? [];
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
    if (base.value === "free") base.valid = true;
    shipping.value = base;
  }

  watch(
    shippingOptions,
    (opts) => {
      if (opts.length && !shipping.value.value) {
        setShipping();
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

export function useShipping() {
  if (_shippingSingleton) return _shippingSingleton;
  _shippingSingleton = createShipping();
  return _shippingSingleton;
}

export type UseShippingReturn = ReturnType<typeof useShipping>;
