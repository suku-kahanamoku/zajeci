<script setup lang="ts">
	const { t } = useI18n();

	const items = [
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
				</div>
			</template>
		</UTabs>

		formular s dodaci adresou
	</div>
</template>
