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
  email: {
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
          <Text class="text-md" py="12">
            {{ tt("$.mailing.contact_form.thank_you") }}
          </Text>

          <Text class="text-sm text-gray-600">
            {{ tt("$.form.email") }}: {{ email }}
          </Text>
          <Text class="text-sm text-gray-600">
            {{ tt("$.form.msg") }}: {{ msg }}
          </Text>

          <Text class="text-md">
            {{ tt("$.mailing.contact_form.message_received") }}
          </Text>
          <Text class="text-md" py="12">
            {{ tt("$.mailing.contact_form.further_questions") }}
          </Text>
          <Text class="text-md">
            {{ tt("$.mailing.contact_form.regards") }},
            <br />
            {{ tt("$.mailing.contact_form.team") }}
          </Text>
          <Hr class="text-gray-600" my="20" />
          <Text class="text-xs text-gray-600">
            © {{ new Date().getFullYear() }}
            <Link :href="url" class="font-bold">Logo</Link>.
            {{ tt("$.footer.reserved") }}.
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
