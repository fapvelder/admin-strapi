/**
 * booking controller
 */

import { factories } from "@strapi/strapi";
import fs from "fs";
import path from "path";

export default factories.createCoreController(
  "api::booking.booking",
  ({ strapi }) => ({
    async createBooking(ctx) {
      try {
        const data = ctx.request.body;
        const { visitDate, timeSlot, email, representative, location } = data;
        // Check for existing bookings
        const existingBooking = await strapi.db
          .query("api::booking.booking")
          .findOne({
            where: {
              location,
              visitDate,
              timeSlot,
              statusBooking: { $ne: "cancelled" },
            },
          });
        // if (existingBooking) {
        //   return ctx.badRequest("This time slot is already booked.");
        // }
        // const newBooking = await strapi
        //   .service("api::booking.booking")
        //   .create({ data });
        // Send confirmation email
        // if (newBooking) {
   

        const emailResult = await strapi.plugins["email"].services.email.send({
          to: email, // Recipient's email
          from: strapi.config.get("SMTP_USERNAME"),
          subject: "Chúng tôi đã nhận được yêu cầu thăm nhà máy của bạn",
          html: `
                  <p>Chào ${representative},</p>
                  <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi xin xác nhận đã nhận được yêu cầu của bạn về việc thăm nhà máy. Chúng tôi rất vui mừng được chào đón bạn đến tham quan và tìm hiểu thêm về quy trình sản xuất của chúng tôi.</p>
                  <p>Chúng tôi sẽ xem xét lịch trình và liên hệ với bạn trong thời gian sớm nhất để xác nhận thời gian và ngày cụ thể cho chuyến thăm.</p>
                  <p>Nếu bạn có bất kỳ câu hỏi nào thêm, xin vui lòng cho chúng tôi biết.</p>
                  <p>Trân trọng,</p>
                  <p>Acecook Việt Nam</p>
                `,
        });
        // If the email was sent successfully, the promise resolves and you can check the result
        if (emailResult.accepted.length > 0) {
          ctx.send({ message: "Email sent successfully!" });
          // return ctx.created(newBooking);
        } else {
          ctx.send({ error: "Email was not sent to any recipients." });
        }
        // }
      } catch (err) {
        ctx.internalServerError(err.message);
      }
    },
    async getTimeSlots(ctx) {
      try {
        // Fetch all existing bookings from today onward
        const today = new Date();
        const bookings = await strapi.db
          .query("api::booking.booking")
          .findMany({
            where: {
              visitDate: { $gte: today },
            },
          });

        // Generate all time slots for the next 3 months
        const allSlots = generateTimeSlots(today, 3, bookings);
        // Send response with both booked and available time slots
        ctx.send(allSlots);
      } catch (err) {
        ctx.send({ message: err.message }, 500);
      }
    },
  })
);
const generateTimeSlots = (startDate, months, existingSlots) => {
  const timeSlots = ["morning", "afternoon"];
  const result = [];
  let currentDate = new Date(startDate);

  // Iterate through the days for the next 3 months
  while (currentDate <= addMonths(new Date(startDate), months)) {
    // For each day, iterate over time slots (morning, afternoon)
    timeSlots.forEach((slot) => {
      const daySlots = existingSlots.filter(
        (existingSlot) =>
          new Date(existingSlot.visitDate).toDateString() ===
            currentDate.toDateString() && existingSlot.timeSlot === slot
      );

      // Determine status based on existing bookings
      let status = "available"; // Default status
      if (daySlots.length > 0) {
        status = daySlots[0].status;
      }

      // Push the time slot with the determined status
      result.push({
        date: currentDate.toISOString().split("T")[0],
        timeSlot: slot,
        status,
      });
    });

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

// Helper function to add months
const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};
