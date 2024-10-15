import axios from "axios";
import { decrypt } from "../src/api/smtp-mail/content-types/smtp-mail/lifecycles";

export default async ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: await getSMTPConfig(),
      settings: {
        defaultFrom: env("SMTP_FROM", "lyhungphatgreenwich@gmail.com"), // "From" email address
        defaultReplyTo: env("SMTP_FROM_NAME", "Your Name"), // "From" name
      },
      options: {
        disableLogs: env.bool("SMTP_DISABLE_LOGS", true), // Disable logs for email sending
      },
    },
  },
  // "environment-variables": {
  //   enabled: true,
  // },
});

const getSMTPConfig = async () => {
  const { data } = await axios.get("http://127.0.0.1:5000/smtp");
  console.log(data);
  console.log(decrypt(data.password));
  return {
    host: data.host,
    port: data.port,
    secure: false,
    // secure: data.secure === 'tls' || data.secure === 'ssl' ? true : false,
    auth: {
      user: data.username,
      pass: decrypt(data.password),
    },
    settings: {
      // defaultFrom: "default@example.com",
      // defaultReplyTo: "default@example.com",
    },
    options: {
      disableLogs: true,
    },
  };
};
