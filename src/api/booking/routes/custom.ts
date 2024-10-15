export default {
  routes: [
    {
      method: "POST",
      path: "/custom",
      handler: "api::booking.booking.createBooking",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/booking/time-slots",
      handler: "api::booking.booking.getTimeSlots",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
