import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

let _cartSingleton: ReturnType<typeof createCart> | null = null;

function createCart() {
  const carts = ref<ICart[]>([]);

  const totalItems = computed(() =>
    carts.value.reduce((total, item) => total + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    carts.value.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    )
  );

  const addItem = (wine: IWine, quantity: number): ICart => {
    let result: ICart;
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
    return result;
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
    }
  };

  const setQuantity = (wineId: string, quantity: number) => {
    const existingItem = carts.value.find((item) => item.wine._id === wineId);
    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
    }
  };

  const deleteItem = (wineId: string) => {
    carts.value = carts.value.filter((item) => item.wine._id !== wineId);
  };

  return {
    carts,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    setQuantity,
    deleteItem,
  };
}

export function useCart() {
  if (_cartSingleton) return _cartSingleton;
  _cartSingleton = createCart();
  return _cartSingleton;
}

export type UseCartReturn = ReturnType<typeof useCart>;
