/**
 * smtp-mail controller
 */

import { factories } from "@strapi/strapi";
import axios from "axios";
const apiUrl = "http://localhost:5000";

export default factories.createCoreController(
  "api::smtp-mail.smtp-mail",
  ({ strapi }) => ({
    async findOne(ctx) {
      const response = await axios.get(`${apiUrl}/smtp`);
      const smtpEntry = await strapi.db
        .query("api::smtp-mail.smtp-mail")
        .findOne();
      if (smtpEntry) {
        // Update the entry with the data from the response
        const updatedEntry = await strapi.db
          .query("api::smtp-mail.smtp-mail")
          .update({
            where: { id: smtpEntry.id },
            data: {
              host: response.data.host,
            },
          });

        ctx.send(updatedEntry); // Send back the updated entry
      }
    },
  })
);
