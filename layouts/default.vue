<script setup lang="ts">
	const menuItems = [
		{
			label: '$.navbar.about',
			to: '/#about',
		},
		{
			label: '$.navbar.wine',
			to: '/wine',
		},
		{
			label: '$.navbar.taste',
			to: '/#tasting',
		},
		{
			label: '$.navbar.contact',
			to: '/#contact',
		},
		{
			label: '$.navbar.gallery',
			to: '/gallery',
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
