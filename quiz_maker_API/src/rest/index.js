const Router = require("@koa/router");

const installQuizRouter = require("./quizes");
const installHealthRouter = require("./health");
const installQuestionRouter = require("./questions");
const intallUsersRouter = require("./user");

module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  intallUsersRouter(router);
  installQuizRouter(router);
  installQuestionRouter(router);
  installHealthRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
