export function useOrders() {
  const { $tt } = useNuxtApp();
  const today = new Date();

  const defaultItem = {
    name: "",
    description: "",
    kind: "",
    quality: "",
    color: "",
    variety: "",
    volume: 0.75,
    year: today.getFullYear(),
    price: 180,
    categories: [],
    published: false,
  };

  const kinds: Record<string, { value: string; label: string }> = {
    dry: { value: "dry", label: $tt("$.admin.wine.kind.dry") },
    semiDry: { value: "semiDry", label: $tt("$.admin.wine.kind.semi_dry") },
    sweet: { value: "sweet", label: $tt("$.admin.wine.kind.sweet") },
    semiSweet: {
      value: "semiSweet",
      label: $tt("$.admin.wine.kind.semi_sweet"),
    },
    extraDry: { value: "extraDry", label: $tt("$.admin.wine.kind.extra_dry") },
    offDry: { value: "offDry", label: $tt("$.admin.wine.kind.off_dry") },
    mediumDry: {
      value: "mediumDry",
      label: $tt("$.admin.wine.kind.medium_dry"),
    },
    mediumSweet: {
      value: "mediumSweet",
      label: $tt("$.admin.wine.kind.medium_sweet"),
    },
    verySweet: {
      value: "verySweet",
      label: $tt("$.admin.wine.kind.very_sweet"),
    },
    dessert: { value: "dessert", label: $tt("$.admin.wine.kind.dessert") },
  };

  const kindOptions = Object.values(kinds);

  const colors: Record<string, { value: string; label: string }> = {
    white: { value: "white", label: $tt("$.admin.wine.color.white") },
    red: { value: "red", label: $tt("$.admin.wine.color.red") },
    rose: { value: "rose", label: $tt("$.admin.wine.color.rose") },
    orange: { value: "orange", label: $tt("$.admin.wine.color.orange") },
  };

  const colorOptions = Object.values(colors);

  const categories: Record<string, { value: string; label: string }> = {
    favourite: {
      value: "favourite",
      label: $tt("$.admin.wine.category.favourite"),
    },
    top: { value: "top", label: $tt("$.admin.wine.category.top") },
    new: { value: "new", label: $tt("$.admin.wine.category.new") },
  };

  const categoryOptions = Object.values(categories);

  const fields: Record<
    string,
    { key: string; label: string; placeholder?: string }
  > = {
    userEmail: {
      key: "user.email",
      label: $tt("$.admin.order.form.user_email"),
    },
    userName: {
      key: "user.name",
      label: $tt("$.admin.order.form.user_name"),
    },
    userSurname: {
      key: "user.surname",
      label: $tt("$.admin.order.form.user_surname"),
    },
    userPhone: {
      key: "user.phone",
      label: $tt("$.admin.order.form.user_phone"),
    },
    deliveryType: {
      key: "delivery.type",
      label: $tt("$.admin.order.form.delivery_type"),
    },
    paymentType: {
      key: "payment.type",
      label: $tt("$.admin.order.form.payment_type"),
    },
  };

  const fieldOptions = Object.values(fields);

  function getChangedParams(
    firstItem: Record<string, any>,
    secondItem: Record<string, any>
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in firstItem) {
      if (firstItem.hasOwnProperty(key) && secondItem.hasOwnProperty(key)) {
        if (
          typeof secondItem[key] !== "undefined" &&
          firstItem[key] !== secondItem[key]
        ) {
          result[key] = secondItem[key];
        }
      }
    }

    return result;
  }

  return {
    kinds,
    kindOptions,
    colors,
    colorOptions,
    categories,
    categoryOptions,
    fields,
    fieldOptions,
    defaultItem,
    getChangedParams,
  };
}
