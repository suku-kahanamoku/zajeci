<script setup>
const props = defineProps({
  url: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
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
  <ETailwind>
    <EHtml>
      <EHead />
      <!-- <EPreview> The sales intelligence platform that helps you uncover qualified leads. </EPreview> -->
      <EBody :style="main">
        <EContainer class="mx-auto pt-4 pb-10">
          <ELink :href="url" class="font-bold block text-center text-xl py-4"
            >Logo</ELink
          >
          <EText class="text-md">
            {{ $t("$.mailing.contact_form.addressed") }},
          </EText>
          <EText class="text-md" py="12">
            {{ $t("$.mailing.forgot_password.request_password") }}
          </EText>
          <EText class="text-md">
            {{ $t("$.mailing.forgot_password.new_password") }}
          </EText>

          <EText class="text-sm text-gray-600">
            {{ $t("$.form.email") }}: {{ email }}
          </EText>
          <EText class="text-sm text-gray-600">
            {{ $t("$.form.password") }}: {{ password }}
          </EText>

          <EText class="text-md">
            {{ $t("$.mailing.forgot_password.contact_us") }}
          </EText>
          <EText class="text-md" py="12">
            {{ $t("$.mailing.forgot_password.further_questions") }}
          </EText>
          <EText class="text-md">
            {{ $t("$.mailing.contact_form.regards") }},
            <br />
            {{ $t("$.mailing.contact_form.team") }}
          </EText>
          <EHr class="text-gray-600" my="20" />
          <EText class="text-xs text-gray-600">
            © {{ new Date().getFullYear() }}
            <ELink :href="url" class="font-bold">Logo</ELink>.
            {{ $t("$.footer.reserved") }}.
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
