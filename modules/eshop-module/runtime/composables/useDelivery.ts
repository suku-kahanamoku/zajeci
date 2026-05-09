import { CLONE } from "@suku-kahanamoku/common-module/utils";
import {
  DeliveryServices,
  type IDelivery,
} from "@/modules/eshop-module/runtime/types/order.interface";

// Delivery option object literals (moved out of useCashdesk)
export const deliveryObjects = {
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

let _deliverySingleton: ReturnType<typeof createDelivery> | null = null;

function createDelivery() {
  // Cart composable singleton
  const { totalPrice } = useCart();

  const delivery = ref<IDelivery>({
    ...deliveryObjects.free,
    // Will be replaced by cashdesk with user's main address via setDelivery(undefined, address)
    address: {} as any,
  });

  const deliveryOptions = computed<IDelivery[]>(() =>
    Object.values(deliveryObjects).map((item) => ({
      ...item,
      // Free delivery threshold (kept same logic as before but based on subtotal, not circular total)
      total_price: totalPrice.value > 2500 ? 0 : item.unit_price,
    }))
  );

  function setDelivery(newDelivery?: IDelivery | null, address?: any) {
    const item = CLONE(newDelivery || deliveryObjects.free);
    item.address = address ? CLONE(address || {}) : item.address;
    item.key = (delivery.value.key || 0) + 1;
    item.total_price = totalPrice.value > 2500 ? 0 : item.unit_price;
    delivery.value = item;
  }

  return {
    delivery,
    deliveryOptions,
    setDelivery,
  };
}

export function useDelivery() {
  if (_deliverySingleton) return _deliverySingleton;
  _deliverySingleton = createDelivery();
  return _deliverySingleton;
}

export type UseDeliveryReturn = ReturnType<typeof useDelivery>;
