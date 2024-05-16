export function useCategories() {
	const { t } = useI18n();
	const today = new Date();

	const defaultItem = {
		name: '',
		description: '',
	};

	const fields: Record<string, { key: string; label: string; placeholder?: string }> = {
		name: {
			key: 'name',
			label: t('$.admin.category.form.name'),
			placeholder: t('$.admin.category.placeholder.name'),
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

	return { fields, fieldOptions, defaultItem, getChangedParams };
}
