<template>
  <div id="about">
    <div class="text-center pt-20 pb-10">
      <h2
        class="text-primary-600 text-4xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.about.title") }}
      </h2>
      <h3 class="pt-8 text-xl font-bold text-gray-600 dark:text-gray-400">
        {{ $tt("$.about.subtitle") }}
      </h3>
    </div>

    <div
      class="from-bottom text-center lg:text-lg text-gray-600 dark:text-white"
    >
      {{ $tt("$.about.description") }}
    </div>
  </div>
</template>
