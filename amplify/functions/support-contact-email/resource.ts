import { defineFunction } from "@aws-amplify/backend";

export const supportContactEmail = defineFunction({
  name: "support-contact-email",
  entry: "./handler.ts",
  environment: {
    VERIFIED_SES_SUPPORT_EMAIL: "svp@enermina.org",
    VERIFIED_SES_SENDER_EMAIL: "svp@enermina.org"
  }
});