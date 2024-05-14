<template>
	<div class="min-h-screen flex flex-col">
		<UiNavbar />

		<main class="flex-1 flex">
			<slot></slot>
		</main>

		<UiFooter></UiFooter>
	</div>
</template>
