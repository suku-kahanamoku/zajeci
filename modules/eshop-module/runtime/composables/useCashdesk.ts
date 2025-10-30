import nuxtStorage from "nuxt-storage";
import type { User } from "#auth-utils";

import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IUser } from "@suku-kahanamoku/auth-module/types";

import { useDelivery } from "./useDelivery";
import { usePayment } from "./usePayment";
import { useCart } from "./useCart";

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

// Singleton holder to preserve reactive state across composable calls (similar to a Pinia store)
let _cashdesk: ReturnType<typeof createCashdesk> | null = null;

function createCashdesk() {
  const localePath = useLocalePath();
  const { user: authUser, loggedIn } = useUserSession();
  const { routes } = useMenuItems();
  const toast = useToast();
  const loading = ref<boolean | null>(null);

  const user = ref<IUser>(CLONE(authUser.value));

  // Cart composable singleton
  const {
    carts,
    addItem,
    removeItem,
    setQuantity,
    deleteItem,
    totalItemsLength,
    totalPrice: cartTotalPrice,
  } = useCart();

  // Delivery & Payment composables (singletons)
  const { delivery, deliveryOptions, setDelivery } = useDelivery();
  const { payment, paymentOptions, setPayment } = usePayment();

  const totalPrice = computed(
    () =>
      cartTotalPrice.value +
      (delivery.value.totalPrice! + payment.value.totalPrice!)
  );

  // Wrap cart mutation methods to keep localStorage updates
  const _addItem = (wine: IWine, quantity: number) => {
    const item = addItem(wine, quantity);
    updateLocalStorage();
    return item;
  };

  const _removeItem = (wineId: string) => {
    removeItem(wineId);
    updateLocalStorage();
  };

  const _setQuantity = (wineId: string, quantity: number) => {
    setQuantity(wineId, quantity);
    updateLocalStorage();
  };

  const _deleteItem = (wineId: string) => {
    deleteItem(wineId);
    updateLocalStorage();
  };

  const setUser = (newUser?: User | null) => {
    const item = CLONE(newUser || authUser.value || emptyUser);
    item.address ||= authUser.value?.address || emptyUser.address;
    item.address.main ||= {};
    user.value = item;
  };

  const reset = () => {
    setUser();
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
    setUser(item.user);
    carts.value = item.carts || [];
    setDelivery(item.delivery, item.address?.main);
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
    // Pokud je prihlaseny uzivatel, ale nejsou validni adresy, aktualizuje je dle prihlaseneho uzivatele
    if (loggedIn.value) {
      if (!user.value.valid) {
        setUser();
      }
      if (!delivery.value.valid) {
        setDelivery(delivery.value, authUser.value?.address?.main);
      }
    }
  });

  watch(user, updateLocalStorage);
  watch(carts, updateLocalStorage);
  watch(delivery, updateLocalStorage);
  watch(payment, updateLocalStorage);

  return {
    loading,
    user,
    setUser,
    carts,
    totalItemsLength,
    totalPrice,
    addItem: _addItem,
    removeItem: _removeItem,
    setQuantity: _setQuantity,
    deleteItem: _deleteItem,
    delivery,
    deliveryOptions,
    setDelivery,
    payment,
    paymentOptions,
    setPayment,
    onSubmit,
    reset,
  };
}

export function useCashdesk() {
  if (_cashdesk) return _cashdesk;
  _cashdesk = createCashdesk();
  return _cashdesk;
}

export type UseCashdeskReturn = ReturnType<typeof useCashdesk>;
