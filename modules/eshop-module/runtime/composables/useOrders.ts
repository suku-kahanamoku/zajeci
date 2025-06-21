export function useOrders() {
  const { t } = useLang();
  const today = new Date();


  const fields: Record<
    string,
    { key: string; label: string; placeholder?: string }
  > = {
    userEmail: {
      key: "user.email",
      label: t("$.admin.order.form.user_email"),
    },
    userName: {
      key: "user.name",
      label: t("$.admin.order.form.user_name"),
    },
    userSurname: {
      key: "user.surname",
      label: t("$.admin.order.form.user_surname"),
    },
    userPhone: {
      key: "user.phone",
      label: t("$.admin.order.form.user_phone"),
    },
    deliveryType: {
      key: "delivery.type",
      label: t("$.admin.order.form.delivery_type"),
    },
    paymentType: {
      key: "payment.type",
      label: t("$.admin.order.form.payment_type"),
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
