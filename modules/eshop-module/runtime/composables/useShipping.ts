import { CLONE } from "@suku-kahanamoku/common-module/utils";
import {
  ShippingServices,
  type IShipping,
} from "@/modules/eshop-module/runtime/types/order.interface";

// Shipping option object literals (moved out of useCashdesk)
export const shippingObjects = {
  free: {
    type: "free",
    label: "$.delivery.brno",
    unit_price: 0,
    avatar: "mdi:home-city-outline",
    help: "$.delivery.brno_free",
    value: "free",
  },
  post: {
    type: "post",
    label: "$.delivery.post",
    unit_price: 209,
    avatar: "/img/delivery/post.jpg",
    help: "$.delivery.not_quaranteed",
    value: "post",
  },
  dpd: {
    type: "dpd",
    label: "$.delivery.dpd",
    unit_price: 150,
    avatar: "mdi:truck-outline",
    help: "$.delivery.not_quaranteed",
    value: "dpd",
  },
  messenger: {
    type: "messenger",
    label: "$.delivery.messenger",
    unit_price: 175,
    avatar: "mdi:truck-outline",
    help: "$.delivery.third_day",
    value: "messenger",
  },
};

let _shippingSingleton: ReturnType<typeof createShipping> | null = null;

function createShipping() {
  // Cart composable singleton
  const { totalPrice } = useCart();

  const shipping = ref<IShipping>({
    ...shippingObjects.free,
    // Will be replaced by cashdesk with user's main address via setShipping(undefined, address)
    address: {} as any,
  });

  const shippingOptions = computed<IShipping[]>(() =>
    Object.values(shippingObjects).map((item) => ({
      ...item,
      // Free shipping threshold (kept same logic as before but based on subtotal, not circular total)
      total_price: totalPrice.value > 2500 ? 0 : item.unit_price,
    }))
  );

  function setShipping(newShipping?: IShipping | null, address?: any) {
    const item = CLONE(newShipping || shippingObjects.free);
    item.address = address ? CLONE(address || {}) : item.address;
    item.key = (shipping.value.key || 0) + 1;
    item.total_price = totalPrice.value > 2500 ? 0 : item.unit_price;
    shipping.value = item;
  }

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
