import { CLONE } from "@suku-kahanamoku/common-module/utils";
import {
  PaymentServices,
  type IPayment,
} from "@/modules/eshop-module/runtime/types/order.interface";

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

let _paymentSingleton: ReturnType<typeof createPayment> | null = null;

function createPayment() {
  // Cart composable singleton
  const { totalPrice } = useCart();

  const payment = ref<IPayment>(paymentObjects.bank);

  const paymentOptions = computed(() =>
    Object.values(paymentObjects).map((item) => ({
      ...item,
      totalPrice: totalPrice.value > 2500 ? 0 : item.unitPrice,
    }))
  );

  function setPayment(newPayment?: IPayment | null) {
    const item = CLONE(
      newPayment || {
        type: PaymentServices.bank,
        totalPrice: 0,
      }
    );
    payment.value = item;
  }

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
