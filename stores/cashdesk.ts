import nuxtStorage from "nuxt-storage";
import type { User } from "#auth-utils";

import {
  DeliveryServices,
  deliveryObjects,
  paymentObjects,
  type IPayment,
  type IDelivery,
  PaymentServices,
  type ICart,
} from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import {
  CLONE,
  ITERATE,
} from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IUser } from "@/modules/auth-module/runtime/types/user.interface";

export const useCashdeskStore = defineStore("Cashdesk", () => {
  const localePath = useLocalePath();
  const auth = useAuthStore();
  const toast = useToast();
  const loading = ref(false);

  const user = ref<IUser>(CLONE(auth.user || auth.emptyUser));
  const carts = ref<ICart[]>([]);
  const delivery = ref<IDelivery>({
    type: DeliveryServices.free,
    address: CLONE(user.value.address?.main || auth.emptyUser.address.main),
    totalPrice: 0,
  });
  const payment = ref<IPayment>({
    type: PaymentServices.bank,
    totalPrice: 0,
  });

  const deliveries: Record<
    string,
    {
      value: string;
      label: string;
      price?: number;
      avatar?: string;
      disabled?: boolean;
      help?: string;
    }
  > = {};
  ITERATE(
    deliveryObjects,
    (item, name) => (deliveries[name] = { ...item, ...{ value: name } })
  );

  const deliveryOptions = computed(() =>
    Object.values(deliveries).map((item) => ({
      ...item,
      price: totalPrice.value > 2500 ? 0 : item.price,
    }))
  );

  const payments: Record<
    string,
    {
      value: string;
      label: string;
      price?: number;
      avatar?: string;
      disabled?: boolean;
    }
  > = {};
  ITERATE(
    paymentObjects,
    (item, name) => (payments[name] = { ...item, ...{ value: name } })
  );

  const paymentOptions = Object.values(payments);

  const totalItems = computed(() => {
    return carts.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(
    () =>
      carts.value.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
      ) +
      delivery.value.totalPrice +
      payment.value.totalPrice
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
    return result;
  };

  const removeItem = (wineId: string) => {
    const itemIndex = carts.value.findIndex((item) => item.wine._id === wineId);
    if (itemIndex !== -1) {
      const item = carts.value[itemIndex];
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

  const setUser = (newUser: User) => {
    user.value = CLONE({ ...auth.emptyUser, ...newUser });
    user.value.address = user.value.address || {};
    // nastavi fakturacni adresu
    user.value.address.main =
      user.value.address?.main || CLONE(auth.emptyUser.address.main);
    delete user.value.address?.variants;
  };

  const reset = () => {
    setUser(auth.user || auth.emptyUser);
    carts.value = [];
    delivery.value = {
      type: DeliveryServices.free,
      address: CLONE(user.value.address?.main || auth.emptyUser.address.main),
      totalPrice: 0,
    };
    payment.value = {
      type: PaymentServices.bank,
      totalPrice: 0,
    };
  };

  const loadFromLocalStorage = () => {
    const local = JSON.parse(
      nuxtStorage.localStorage.getData("cashdesk") || "{}"
    );
    if (local) {
      if (local.user) {
        // prida id prihlaseneho uzivatele
        local.user._id = user.value._id;
        // prida id fakturacni adresy
        local.user.address.main._id = user.value.address?.main?._id;
        setUser(local.user);
      }
      if (local.carts) {
        carts.value = local.carts;
      }
      if (local.delivery) {
        delivery.value = local.delivery;
        delivery.value.address =
          delivery.value.address || CLONE(auth.emptyUser.address.main);
      }
      if (local.payment) {
        payment.value = local.payment;
      }
    }
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
      if (result.data?._id) {
        // aktualizace prihlaseneho uzivatele
        await auth.fetch();
        reset();
        navigateTo({
          path: localePath("cashdesk-completed"),
          query: {
            orderId: result.data._id,
            email: result.data.user.email,
          },
        });
      }
    } catch (error: any) {
      toast.add({
        title: error.data.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
      });
    }
    loading.value = false;
  }

  onBeforeMount(() => {
    loadFromLocalStorage();
    watch(user, updateLocalStorage, { deep: true });
    watch(carts, updateLocalStorage, { deep: true });
    watch(delivery, updateLocalStorage, { deep: true });
    watch(payment, updateLocalStorage, { deep: true });
  });

  return {
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
    deliveries,
    deliveryOptions,
    payment,
    payments,
    paymentOptions,
    onSubmit,
  };
});
