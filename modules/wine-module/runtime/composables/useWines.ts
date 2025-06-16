export function useWines() {
  const { t } = useLang();

  const kinds: Record<string, { value: string; label: string }> = {
    dry: { value: "dry", label: t("$.admin.wine.kind.dry") },
    semiDry: { value: "semiDry", label: t("$.admin.wine.kind.semi_dry") },
    sweet: { value: "sweet", label: t("$.admin.wine.kind.sweet") },
    semiSweet: {
      value: "semiSweet",
      label: t("$.admin.wine.kind.semi_sweet"),
    },
    extraDry: { value: "extraDry", label: t("$.admin.wine.kind.extra_dry") },
    offDry: { value: "offDry", label: t("$.admin.wine.kind.off_dry") },
    mediumDry: {
      value: "mediumDry",
      label: t("$.admin.wine.kind.medium_dry"),
    },
    mediumSweet: {
      value: "mediumSweet",
      label: t("$.admin.wine.kind.medium_sweet"),
    },
    verySweet: {
      value: "verySweet",
      label: t("$.admin.wine.kind.very_sweet"),
    },
    dessert: { value: "dessert", label: t("$.admin.wine.kind.dessert") },
  };

  const kindOptions = Object.values(kinds);

  const colors: Record<string, { value: string; label: string }> = {
    white: { value: "white", label: t("$.admin.wine.color.white") },
    red: { value: "red", label: t("$.admin.wine.color.red") },
    rose: { value: "rose", label: t("$.admin.wine.color.rose") },
    orange: { value: "orange", label: t("$.admin.wine.color.orange") },
  };

  const colorOptions = Object.values(colors);

  const categories: Record<string, { value: string; label: string }> = {
    favourite: {
      value: "favourite",
      label: t("$.admin.wine.category.favourite"),
    },
    top: { value: "top", label: t("$.admin.wine.category.top") },
    new: { value: "new", label: t("$.admin.wine.category.new") },
  };

  const categoryOptions = Object.values(categories);

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
    getChangedParams,
  };
}
