export function useWines() {
	const { t } = useI18n();
	const today = new Date();

	const defaultItem = {
		name: '',
		description: '',
		kind: '',
		quality: '',
		color: '',
		variety: '',
		volume: 0.75,
		year: today.getFullYear(),
		price: 180,
		categories: [],
		published: false,
	};

	const kinds: Record<string, { value: string; label: string }> = {
		dry: { value: 'dry', label: t('$.admin.wine.kind.dry') },
		semi_dry: { value: 'semi_dry', label: t('$.admin.wine.kind.semi_dry') },
		sweet: { value: 'sweet', label: t('$.admin.wine.kind.sweet') },
		semi_sweet: { value: 'semi_sweet', label: t('$.admin.wine.kind.semi_sweet') },
		extra_dry: { value: 'extra_dry', label: t('$.admin.wine.kind.extra_dry') },
		off_dry: { value: 'off_dry', label: t('$.admin.wine.kind.off_dry') },
		medium_dry: { value: 'medium_dry', label: t('$.admin.wine.kind.medium_dry') },
		medium_sweet: { value: 'medium_sweet', label: t('$.admin.wine.kind.medium_sweet') },
		very_sweet: { value: 'very_sweet', label: t('$.admin.wine.kind.very_sweet') },
		dessert: { value: 'dessert', label: t('$.admin.wine.kind.dessert') },
	};

	const kindOptions = Object.values(kinds);

	const colors: Record<string, { value: string; label: string }> = {
		white: { value: 'white', label: t('$.admin.wine.color.white') },
		red: { value: 'red', label: t('$.admin.wine.color.red') },
		rose: { value: 'rose', label: t('$.admin.wine.color.rose') },
		orange: { value: 'orange', label: t('$.admin.wine.color.orange') },
	};

	const colorOptions = Object.values(colors);

	const categories: Record<string, { value: string; label: string }> = {
		favourite: { value: 'favourite', label: t('$.admin.wine.category.favourite') },
		top: { value: 'top', label: t('$.admin.wine.category.top') },
		new: { value: 'new', label: t('$.admin.wine.category.new') },
	};

	const categoryOptions = Object.values(categories);

	const fields: Record<string, { key: string; label: string; placeholder?: string }> = {
		name: {
			key: 'name',
			label: t('$.admin.wine.form.name'),
			placeholder: t('$.admin.wine.placeholder.name'),
		},
		kind: {
			key: 'kind',
			label: t('$.admin.wine.form.kind'),
			placeholder: t('$.form.select'),
		},
		quality: {
			key: 'quality',
			label: t('$.admin.wine.form.quality'),
			placeholder: t('$.admin.wine.placeholder.quality'),
		},
		color: {
			key: 'color',
			label: t('$.admin.wine.form.color'),
			placeholder: t('$.form.select'),
		},
		variety: {
			key: 'variety',
			label: t('$.admin.wine.form.variety'),
			placeholder: t('$.admin.wine.placeholder.variety'),
		},
		volume: {
			key: 'volume',
			label: t('$.admin.wine.form.volume'),
		},
		year: {
			key: 'year',
			label: t('$.admin.wine.form.year'),
		},
		price: {
			key: 'price',
			label: t('$.form.price'),
		},
		categories: {
			key: 'categories',
			label: t('$.form.categories'),
			placeholder: t('$.form.select'),
		},
		description: {
			key: 'description',
			label: t('$.form.description'),
		},
	};

	const fieldOptions = Object.values(fields);

	function getChangedParams(firstItem: Record<string, any>, secondItem: Record<string, any>): Record<string, any> {
		const zmeny: Record<string, any> = {};

		for (const klic in firstItem) {
			if (firstItem.hasOwnProperty(klic) && secondItem.hasOwnProperty(klic)) {
				if (typeof secondItem[klic] !== 'undefined' && firstItem[klic] !== secondItem[klic]) {
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
