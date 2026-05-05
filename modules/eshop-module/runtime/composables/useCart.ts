import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

let _cartSingleton: ReturnType<typeof createCart> | null = null;

function createCart() {
  const carts = ref<ICart[]>([]);

  const totalItemsLength = computed(() =>
    carts.value.reduce((total, item) => total + item.quantity, 0),
  );

  const totalPrice = computed(() =>
    carts.value.reduce((total, item) => total + item.totalPrice, 0),
  );

  const addItem = (wine: IWine, quantity: number): ICart => {
    let result: ICart;
    const existingItem = carts.value.find((item) => item.wine.id === wine.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
      result = existingItem;
    } else {
      const newItem: ICart = {
        wine,
        quantity,
        unitPrice: Number(wine.price),
        totalPrice: Number(wine.price) * quantity,
      };
      carts.value.push(newItem);
      result = newItem;
    }
    return result;
  };

  const removeItem = (wineId: number) => {
    const itemIndex = carts.value.findIndex((item) => item.wine.id === wineId);
    if (itemIndex >= 0) {
      const item = carts.value[itemIndex]!;
      item.quantity -= 1;
      item.totalPrice = item.unitPrice * item.quantity;
      if (item.quantity <= 0) {
        carts.value.splice(itemIndex, 1);
      }
    }
  };

  const setQuantity = (wineId: number, quantity: number) => {
    const existingItem = carts.value.find((item) => item.wine.id === wineId);
    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
    }
  };

  const deleteItem = (wineId: number) => {
    carts.value = carts.value.filter((item) => item.wine.id !== wineId);
  };

  return {
    carts,
    totalItemsLength,
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
