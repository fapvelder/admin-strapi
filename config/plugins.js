
          export default ({ env }) => ({
            email: {
              config: {
                provider: "nodemailer",
                providerOptions: {
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false,
                  auth: {
                    user: "lyhungphatgreenwich@gmail.com",
                    pass: "dgcktkqqugnchlxb",
                  },
                  settings: {
                    defaultFrom: "default@example.com",
                    defaultReplyTo: "default@example.com",
                  },
                  options: {
                    disableLogs: true,
                  },
                },
                settings: {
                  defaultFrom: env("SMTP_FROM", "lyhungphatgreenwich@gmail.com"), // "From" email address
                  defaultReplyTo: env("SMTP_FROM_NAME", "Your Name"), // "From" name
                },
                options: {
                  disableLogs: env.bool("SMTP_DISABLE_LOGS", true), // Disable logs for email sending
                },
              },
            },
          });
          