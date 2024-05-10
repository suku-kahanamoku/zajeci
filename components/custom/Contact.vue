<template>
	<div id="contact" class="py-10 lg:py-16">
		<div class="text-center pb-8 lg:pb-10">
			<h2 class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
				{{ $t('$.contact.title') }}
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-10 mx-auto max-w-screen-lg py-4">
			<div class="from-left">
				<h3 class="font-medium text-xl lg:text-2xl text-gray-700 dark:text-primary-400">
					{{ $t('$.contact.subtitle') }}
				</h3>
				<p class="lg:text-lg text-gray-600 dark:text-gray-400 mt-3">{{ $t('$.contact.appointment') }}</p>
				<div class="mt-5">
					<div class="flex items-center mt-3 space-x-3 text-gray-600">
						<Icon class="text-secondary-400" name="uil:envelope" size="26" />
						<a
							class="contact__item contact__item--lg contact__item--email dark:text-white"
							href="mailto:vyborne@vinozezajeci.cz"
						>
							vyborne@vinozezajeci.cz
						</a>
					</div>
					<div class="flex items-center mt-3 space-x-3 text-gray-600">
						<Icon class="text-secondary-400" name="uil:phone" size="26" />
						<a
							class="contact__item contact__item--lg contact__item--tel dark:text-white"
							href="tel:+420770199999"
						>
							+420 770 199 999
						</a>
					</div>
					<div class="flex items-center mt-3 space-x-3 text-gray-600">
						<Icon class="text-secondary-400" name="mdi:phone-classic" size="26" />
						<a
							class="contact__item contact__item--lg contact__item--tel dark:text-white"
							href="tel:+420 778 711 111"
						>
							+420 778 711 111
						</a>
					</div>
					<div class="flex items-start mt-3 space-x-3 text-gray-600">
						<Icon class="text-secondary-400" name="uil:map-marker" size="26" />
						<span class="dark:text-white">
							Školní 156, 69105 Zaječí<br />
							IČ 19737491, DIČ CZ7951084053
						</span>
					</div>
				</div>
			</div>
			<div class="from-right">
				<CustomFormContact />
			</div>
		</div>

		<div class="mt-12">
			<iframe style="border: none" src="https://en.frame.mapy.cz/s/pemudahace" width="100%" height="300"></iframe>
		</div>
	</div>
</template>
