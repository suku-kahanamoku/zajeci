<script setup lang="ts">
	const { t } = useI18n();

	const items = [
		{
			key: 'anonymous',
			label: t('$.cashdesk.anonymous'),
		},
		{
			key: 'login',
			label: t('$.navbar.login'),
		},
		{
			key: 'signup',
			label: t('$.navbar.signup'),
		},
	];

	const selected = ref();
</script>
<template>
	<div>
		<UTabs v-if="!useAuthStore().loggedIn" v-model="selected" :items="items">
			<template #item="{ item }">
				<div class="flex items-center justify-center mx-auto w-full">
					<CustomFormLogin v-if="item.key === 'login'" />
					<CustomFormSignup v-else-if="item.key === 'signup'" />
					<CustomCashdeskContact v-else />
				</div>
			</template>
		</UTabs>
		<div v-else class="flex items-center justify-center mx-auto w-full">
			<CustomCashdeskContact />
		</div>
		<div class="flex flex-col md:flex-row items-stretch justify-between md:gap-8">
			<CustomCashdeskDelivery />
			<CustomCashdeskPayment />
		</div>
	</div>
</template>
