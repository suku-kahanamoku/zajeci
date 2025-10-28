import nuxtStorage from "nuxt-storage";
import type { User } from "#auth-utils";

import {
  DeliveryServices,
  type IPayment,
  type IDelivery,
  PaymentServices,
  type ICart,
} from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import { CLONE, ITERATE } from "@suku-kahanamoku/common-module/utils";
import type { IUser } from "@suku-kahanamoku/auth-module/types";

const emptyUser = {
  email: "",
  name: "",
  surname: "",
  givenName: "",
  address: {
    main: {} as any,
  },
  phone: "",
};

export const deliveryObjects = {
  free: {
    type: "free",
    label: "$.delivery.brno",
    unitPrice: 0,
    avatar: "mdi:home-city-outline",
    help: "$.delivery.brno_free",
    key: 0,
    value: "free",
  },
  post: {
    type: "post",
    label: "$.delivery.post",
    unitPrice: 209,
    avatar: "/img/delivery/post.jpg",
    help: "$.delivery.not_quaranteed",
    key: 0,
    value: "post",
  },
  dpd: {
    type: "dpd",
    label: "$.delivery.dpd",
    unitPrice: 150,
    avatar: "mdi:truck-outline",
    help: "$.delivery.not_quaranteed",
    key: 0,
    value: "dpd",
  },
  messenger: {
    type: "messenger",
    label: "$.delivery.messenger",
    unitPrice: 175,
    avatar: "mdi:truck-outline",
    help: "$.delivery.third_day",
    key: 0,
    value: "messenger",
  },
};

export const paymentObjects = {
  cash: {
    type: "cash",
    label: "$.payment.cash",
    unitPrice: 0,
    avatar: "mdi:cash-100",
    value: "cash",
  },
  bank: {
    type: "bank",
    label: "$.payment.bank",
    unitPrice: 0,
    avatar: "mdi:bank-outline",
    value: "bank",
  },
  card: {
    type: "card",
    label: "$.payment.card",
    unitPrice: 0,
    avatar: "mdi:credit-card-outline",
    disabled: true,
    value: "card",
  },
  paypal: {
    type: "paypal",
    label: "$.payment.paypal",
    unitPrice: 0,
    avatar: "logos:paypal",
    disabled: true,
    value: "paypal",
  },
  gopay: {
    type: "gopay",
    label: "$.payment.gopay",
    unitPrice: 0,
    avatar: "arcticons:gopay",
    disabled: true,
    value: "gopay",
  },
  apple_pay: {
    type: "apple_pay",
    label: "$.payment.apple_pay",
    unitPrice: 0,
    avatar: "simple-icons:applepay",
    disabled: true,
    value: "apple_pay",
  },
  google_pay: {
    type: "google_pay",
    label: "$.payment.google_pay",
    unitPrice: 0,
    avatar: "simple-icons:googlepay",
    disabled: true,
    value: "google_pay",
  },
};

// Singleton holder to preserve reactive state across composable calls (similar to a Pinia store)
let _cashdesk: ReturnType<typeof createCashdesk> | null = null;

function createCashdesk() {
  const localePath = useLocalePath();
  const { user: authUser } = useUserSession();
  const { routes } = useMenuItems();
  const toast = useToast();
  const loading = ref<boolean | null>(null);
  const key = ref(0);

  const user = ref<IUser>(CLONE(authUser.value || emptyUser));
  const carts = ref<ICart[]>([]);

  const delivery = ref<IDelivery>({
    ...deliveryObjects.free,
    address: CLONE(user.value?.address?.main || {}),
  });

  const deliveryOptions = computed(() =>
    Object.values(deliveryObjects)?.map((item) => ({
      ...item,
      totalPrice: totalPrice.value > 2500 ? 0 : item.unitPrice,
    }))
  );

  const payment = ref<IPayment>(paymentObjects.bank);

  const paymentOptions = computed(() =>
    Object.values(paymentObjects)?.map((item) => ({
      ...item,
      totalPrice: totalPrice.value > 2500 ? 0 : item.unitPrice,
    }))
  );

  const totalItems = computed(() => {
    return carts.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(
    () =>
      carts.value.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
      ) +
      (delivery.value.unitPrice + payment.value.unitPrice)
  );

  const addItem = (wine: IWine, quantity: number): ICart => {
    let result;
    const existingItem = carts.value.find((item) => item.wine._id === wine._id);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
      result = existingItem;
    } else {
      const newItem: ICart = {
        wine,
        quantity,
        unitPrice: wine.price,
        totalPrice: wine.price * quantity,
      };
      carts.value.push(newItem);
      result = newItem;
    }
    updateLocalStorage();
    return result as ICart;
  };

  const removeItem = (wineId: string) => {
    const itemIndex = carts.value.findIndex((item) => item.wine._id === wineId);
    if (itemIndex >= 0) {
      const item = carts.value[itemIndex]!;
      item.quantity -= 1;
      item.totalPrice = item.unitPrice * item.quantity;
      if (item.quantity <= 0) {
        carts.value.splice(itemIndex, 1);
      }
      updateLocalStorage();
    }
  };

  const setQuantity = (wineId: string, quantity: number) => {
    const existingItem = carts.value.find((item) => item.wine._id === wineId);
    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
      updateLocalStorage();
    }
  };

  const deleteItem = (wineId: string) => {
    carts.value = carts.value.filter((item) => item.wine._id !== wineId);
    updateLocalStorage();
  };

  const setUser = (newUser?: User | null) => {
    const item = CLONE(newUser || emptyUser);
    item.address ||= emptyUser.address;
    item.address.main ||= {} as any;
    user.value = item;
  };

  const setDelivery = (newDelivery?: IDelivery | null) => {
    const item = CLONE(
      newDelivery || {
        type: DeliveryServices.free,
        address: CLONE(user.value.address?.main),
        totalPrice: 0,
        key: 0,
      }
    );
    delivery.value = item;
  };

  const setPayment = (newPayment?: IDelivery | null) => {
    const item = CLONE(
      newPayment || {
        type: PaymentServices.bank,
        totalPrice: 0,
      }
    );
    payment.value = item;
  };

  const reset = () => {
    setUser(authUser.value);
    carts.value = [];
    setDelivery();
    setPayment();
  };

  const loadFromLocalStorage = () => {
    let item;
    try {
      item = JSON.parse(nuxtStorage.localStorage.getData("cashdesk") || "{}");
    } catch (error) {
      item = {};
    }
    setUser(item.user || authUser.value);
    carts.value = item.carts || [];
    setDelivery(item.delivery);
    setPayment(item.payment);
    loading.value = false;
  };

  const updateLocalStorage = () => {
    const order = {
      user: user.value,
      carts: carts.value,
      delivery: delivery.value,
      payment: payment.value,
      totalPrice: totalPrice.value,
    };
    nuxtStorage.localStorage.setData("cashdesk", JSON.stringify(order), 7, "d");
    key.value++;
  };

  async function onSubmit() {
    loading.value = true;

    try {
      const order = {
        user: user.value,
        carts: carts.value,
        delivery: delivery.value,
        payment: payment.value,
        totalPrice: totalPrice.value,
      };
      const result = await $fetch("/api/order", {
        method: "POST",
        body: order,
      });
      if ((result as any).data?._id) {
        reset();
        navigateTo({
          path: localePath(routes.cashdesk_completed?.path!),
          query: {
            orderId: (result as any).data._id,
            email: (result as any).data.user.email,
          },
        });
      }
    } catch (error: any) {
      toast.add({
        title: error.data?.message || error.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
      });
    }

    loading.value = false;
  }

  onMounted(() => {
    loadFromLocalStorage();
    watch(user, updateLocalStorage, { deep: true });
    watch(carts, updateLocalStorage, { deep: true });
    watch(delivery, updateLocalStorage, { deep: true });
    watch(payment, updateLocalStorage, { deep: true });
  });

  return {
    key,
    loading,
    user,
    carts,
    addItem,
    removeItem,
    setQuantity,
    deleteItem,
    reset,
    setUser,
    totalItems,
    totalPrice,
    delivery,
    deliveryOptions,
    payment,
    paymentOptions,
    onSubmit,
  };
}

export function useCashdesk() {
  if (_cashdesk) return _cashdesk;
  _cashdesk = createCashdesk();
  return _cashdesk;
}

export type UseCashdeskReturn = ReturnType<typeof useCashdesk>;
