<script setup>
import {
  Tailwind,
  Html,
  Head,
  Body,
  Container,
  Link,
  Text,
  Hr,
} from "@vue-email/components";

const props = defineProps({
  tt: Function,
  url: {
    type: String,
  },
  msg: {
    type: String,
  },
});

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
</script>

<template>
  <Tailwind>
    <Html>
      <Head />
      <!-- <Preview> The sales intelligence platform that helps you uncover qualified leads. </Preview> -->
      <Body :style="main">
        <Container class="mx-auto pt-4 pb-10">
          <Link :href="url" class="font-bold block text-center text-xl py-4"
            >Logo</Link
          >
          <Text class="text-md">
            {{ tt("$.mailing.contact_form.addressed") }},
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
