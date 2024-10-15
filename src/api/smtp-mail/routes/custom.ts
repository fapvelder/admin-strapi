export default {
  routes: [
    {
      method: "GET",
      path: "/smtp-mail",
      handler: "smtp-mail.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
