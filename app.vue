<script setup lang="ts">
	const { locale } = useI18n();
	const auth = useAuthStore();
	const cashdesk = useCashdeskStore();

	useHead({
		htmlAttrs: {
			lang: locale,
		},
	});

	watch(
		() => auth.loggedIn,
		(value, oldValue) => {
			
		}
	);
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<UNotifications />
	<UiCookieBanner />
</template>
