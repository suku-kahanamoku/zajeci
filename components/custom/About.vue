<template>
  <div id="about" class="relative">
    <div class="text-center pt-20 pb-8">
      <p class="text-xs font-semibold tracking-[0.25em] uppercase text-secondary-500 dark:text-secondary-400 mb-3">
        {{ $tt("$.about.eyebrow") || "Naše příběh" }}
      </p>
      <h2 class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 leading-tight mb-6">
        {{ $tt("$.about.title") }}
      </h2>
      <div class="section-divider text-primary-300 dark:text-primary-600 w-full mt-6 mb-2">
        <UIcon name="ph:wine-duotone" size="18" />
      </div>
      <h3 class="text-xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {{ $tt("$.about.subtitle") }}
      </h3>
    </div>

    <div class="from-bottom text-center lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
      {{ $tt("$.about.description") }}
    </div>
  </div>
</template>

