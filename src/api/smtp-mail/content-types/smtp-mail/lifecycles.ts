import axios from "axios";
import crypto from "crypto";
import { exec } from "child_process";

export const secretKey = "thisisasecretkey";
const key = crypto.scryptSync(secretKey, "salt", 32); // Derive a key from the passphrase

// Function to encrypt text
export function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return a single string containing IV and encrypted data
  return `${iv.toString("hex")}:${encrypted}`;
}

// Function to decrypt text
export function decrypt(encryptedString) {
  const [iv, encryptedData] = encryptedString.split(":"); // Split the IV and the encrypted data
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
export default {
  async afterUpdate(event) {
    // Check if the entry was published
    const { result } = event;
    const data = await axios.put(
      "http://localhost:5000/smtp/67079f178b528da829ff07eb",
      {
        host: result.host,
        secure: result.secure,
        port: result.port,
        disableLogs: result.disableLogs,
        username: result.username,
        password: result.password,
      }
    );
    if (data) {
      // console.log(data);
      // exec("yarn build && yarn develop", (err, stdout, stderr) => {
      //   if (err) {
      //     console.error(`Error restarting Strapi: ${err}`);
      //     return;
      //   }
      //   console.log(`Strapi restarted successfully: ${stdout}`);
      //   if (stderr) console.error(`Strapi stderr: ${stderr}`);
      // });
    }
  },

  async beforeFindMany(event) {
    const apiUrl = "http://localhost:5000";

    // Fetch the SMTP data from the external API
    const response = await axios.get(`${apiUrl}/smtp`);
    const smtpData = response.data;
    // Fetch the existing entry from Strapi
    const smtpEntry = await strapi.db
      .query("api::smtp-mail.smtp-mail")
      .findOne();

    if (smtpEntry) {
      // Compare the current data in the database with the data from the API
      const dataIsDifferent =
        smtpEntry.host !== smtpData.host ||
        smtpEntry.secure !== smtpData.secure ||
        smtpEntry.port !== smtpData.port ||
        smtpEntry.disableLogs !== smtpData.disableLogs ||
        smtpEntry.username !== smtpData.username ||
        smtpEntry.password !== decrypt(smtpData.password);
      // Update only if the data is different
      if (dataIsDifferent) {
        await strapi.db.query("api::smtp-mail.smtp-mail").update({
          where: { id: smtpEntry.id },
          data: {
            host: smtpData.host,
            secure: smtpData.secure,
            port: smtpData.port,
            disableLogs: smtpData.disableLogs,
            username: smtpData.username,
            password: smtpData.password,
          },
        });
      }
    }
  },
};
