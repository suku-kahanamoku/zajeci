<script setup lang="ts">
	const menuItems = [
		{
			label: '$.dashboard.title',
			to: '/admin',
		},
		{
			label: '$.admin.wine.title',
			to: '/admin/wine',
		},
		{
			label: '$.admin.category.title',
			to: '/admin/category',
		},
	];
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<UiNavbar :menuItems="menuItems" />

		<main class="flex-1 flex">
			<slot></slot>
		</main>

		<UiFooter></UiFooter>
	</div>
</template>
