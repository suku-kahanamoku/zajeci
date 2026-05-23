import nuxtStorage from "nuxt-storage";
import type { User } from "#auth-utils";

import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IUser } from "@/modules/user-module/runtime/types/user.interface";

import { useShipping } from "./useShipping";
import { usePayment } from "./usePayment";
import { useCart } from "./useCart";

const emptyUser = {
  email: "",
  name: "",
  first_name: "",
  last_name: "",
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
  const { error: toastError } = useToastify();
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

  // Shipping & Payment composables (singletons)
  const { shipping, shippingOptions, setShipping } = useShipping();
  const { payment, paymentOptions, setPayment } = usePayment();

  const totalPrice = computed(
    () =>
      cartTotalPrice.value +
      (shipping.value.price! + (payment.value.data?.price ?? 0)),
  );

  // Wrap cart mutation methods to keep localStorage updates
  const _addItem = (wine: IWine, quantity: number) => {
    const item = addItem(wine, quantity);
    updateLocalStorage();
    return item;
  };

  const _removeItem = (wineId: number) => {
    removeItem(wineId);
    updateLocalStorage();
  };

  const _setQuantity = (wineId: number, quantity: number) => {
    setQuantity(wineId, quantity);
    updateLocalStorage();
  };

  const _deleteItem = (wineId: number) => {
    deleteItem(wineId);
    updateLocalStorage();
  };

  const setUser = (newUser?: User | null) => {
    const item = CLONE(newUser || authUser.value || emptyUser);
    item.address ||= authUser.value?.address || emptyUser.address;
    item.address.main ||= {};
    user.value = item;
  };

  // Validation state for step 2 (billing + shipping forms) — set by child components
  const userStepValid = ref(false);
  const _billingValid = ref(false);
  const _shippingValid = ref(false);
  const _updateUserStepValid = () => {
    userStepValid.value = _billingValid.value && _shippingValid.value;
  };
  const setBillingValid = (v: boolean) => {
    _billingValid.value = v;
    _updateUserStepValid();
  };
  const setShippingValid = (v: boolean) => {
    _shippingValid.value = v;
    _updateUserStepValid();
  };

  const reset = () => {
    setUser();
    carts.value = [];
    setShipping();
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
    setShipping(item.shipping);
    setPayment(item.payment);
    loading.value = false;
  };

  const updateLocalStorage = () => {
    const order = {
      user: user.value,
      carts: carts.value,
      shipping: shipping.value,
      billing: payment.value,
      total_price: totalPrice.value,
    };
    nuxtStorage.localStorage.setData("cashdesk", JSON.stringify(order), 7, "d");
  };

  async function onSubmit() {
    loading.value = true;

    try {
      const order = {
        user: user.value,
        carts: carts.value,
        shipping: shipping.value,
        billing: payment.value,
        total_price: totalPrice.value,
      };
      const result = await useApi("/api/order", {
        method: "POST",
        body: order,
      });
      if ((result as any).data?.id) {
        reset();
        navigateTo({
          path: localePath(routes.cashdesk_completed?.path!),
          query: {
            orderId: (result as any).data.id,
            email: user.value?.email,
          },
        });
      }
    } catch (error: any) {
      toastError(error);
    }

    loading.value = false;
  }

  onMounted(() => {
    loadFromLocalStorage();
    // Pokud je prihlaseny uzivatel, ale v localStorage neni zadny uzivatel, nacte ho z auth
    if (loggedIn.value && !user.value.email) {
      setUser();
    }
  });

  watch(user, updateLocalStorage);
  watch(carts, updateLocalStorage);
  watch(shipping, updateLocalStorage);
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
    shipping,
    shippingOptions,
    setShipping,
    payment,
    paymentOptions,
    setPayment,
    onSubmit,
    reset,
    userStepValid,
    setBillingValid,
    setShippingValid,
  };
}

export function useCashdesk() {
  if (_cashdesk) return _cashdesk;
  _cashdesk = createCashdesk();
  return _cashdesk;
}

export type UseCashdeskReturn = ReturnType<typeof useCashdesk>;
