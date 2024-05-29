<script setup lang="ts">
	import { DeliveryServices } from './server/types/order.type';

	const { locale } = useI18n();
	const auth = useAuthStore();
	const cashdesk = useCashdeskStore();

	useHead({
		htmlAttrs: {
			lang: locale,
		},
	});

	onMounted(() => {
		setCashdesk();
	});

	watch(
		() => auth.loggedIn,
		(value, oldValue) => {
			// prihlaseni
			if (value === true && oldValue === false) {
				setCashdesk();
			}
			//
			else if (value === false && oldValue === true) {
				cashdesk.reset();
			}
		}
	);

	function setCashdesk() {
		if (auth.user) {
			// pokud neni vyplnena fakturacni adresa, doplni
			if (!cashdesk.user.valid) {
				cashdesk.setUser(auth.user);
			}
			// pokud neni vyplnena dodaci adresa, doplni
			if (
				!cashdesk.delivery.valid &&
				[DeliveryServices.free, DeliveryServices.post].includes(cashdesk.delivery.type)
			) {
				cashdesk.delivery.address = CLONE(auth.user.address?.main);
			}
		}
	}
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<UNotifications />
	<UiCookieBanner />
</template>
