export function useWines() {
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
    name: {
      key: "name",
      label: $tt("$.admin.wine.form.name"),
      placeholder: $tt("$.admin.wine.placeholder.name"),
    },
    kind: {
      key: "kind",
      label: $tt("$.admin.wine.form.kind"),
      placeholder: $tt("$.form.select"),
    },
    quality: {
      key: "quality",
      label: $tt("$.admin.wine.form.quality"),
      placeholder: $tt("$.admin.wine.placeholder.quality"),
    },
    color: {
      key: "color",
      label: $tt("$.admin.wine.form.color"),
      placeholder: $tt("$.form.select"),
    },
    variety: {
      key: "variety",
      label: $tt("$.admin.wine.form.variety"),
      placeholder: $tt("$.admin.wine.placeholder.variety"),
    },
    volume: {
      key: "volume",
      label: $tt("$.admin.wine.form.volume"),
    },
    year: {
      key: "year",
      label: $tt("$.admin.wine.form.year"),
    },
    price: {
      key: "price",
      label: $tt("$.form.price"),
    },
    quantity: {
      key: "quantity",
      label: $tt("$.form.quantity_stock"),
    },
    categories: {
      key: "categories",
      label: $tt("$.form.categories"),
      placeholder: $tt("$.form.select"),
    },
    description: {
      key: "description",
      label: $tt("$.form.description"),
    },
  };

  const fieldOptions = Object.values(fields);

  function getChangedParams(
    firstItem: Record<string, any>,
    secondItem: Record<string, any>
  ): Record<string, any> {
    const zmeny: Record<string, any> = {};

    for (const klic in firstItem) {
      if (firstItem.hasOwnProperty(klic) && secondItem.hasOwnProperty(klic)) {
        if (
          typeof secondItem[klic] !== "undefined" &&
          firstItem[klic] !== secondItem[klic]
        ) {
          zmeny[klic] = secondItem[klic];
        }
      }
    }

    return zmeny;
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
