const Router = require("@koa/router");
const Joi = require("joi");

const userService = require("../service/user");
const quizesService = require("../service/quiz");
const { hasPermission, permissions } = require("../core/auth");

const validate = require("./validation.js");

const getAllQuizes = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await quizesService.getAll(limit, offset);
};
getAllQuizes.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().min(0).optional(),
  }).and("limit", "offset"),
};

const getAllQuizesFromUser = async (ctx) => {
  ctx.body = await quizesService.getAllFromUser(ctx.params.user_id);
};
getAllQuizesFromUser.validationScheme = {
  params: {
    user_id: Joi.string(),
  },
};

const getAmountOfQuizes = async (ctx) => {
  ctx.body = await quizesService.getAmountOfQuizesFromUser(ctx.params.user_id);
};
getAmountOfQuizes.validationScheme = {
  params: {
    user_id: Joi.string().uuid(),
  },
};

const getQuizById = async (ctx) => {
  ctx.body = await quizesService.getById(ctx.params.id);
};
getQuizById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const createQuiz = async (ctx) => {
  let userId = 0;
  const user = await userService.getByAuth0Id(ctx.state.user.sub);
  userId = user.id;
  const newQuiz = await quizesService.create({
    ...ctx.request.body,
    user_id: userId,
  });
  ctx.body = newQuiz;
  ctx.status = 201;
};
createQuiz.validationScheme = {
  body: {
    id: Joi.string().uuid(),
    name: Joi.string().max(255),
    description: Joi.string().max(255),
    category: Joi.string().max(255),
    user_id: Joi.string().uuid(),
  },
};

const updateQuiz = async (ctx) => {
  ctx.body = await quizesService.update(ctx.params.id, ctx.request.body);
};
updateQuiz.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    description: Joi.string().max(255),
    category: Joi.string().max(255),
  },
};

const deleteQuiz = async (ctx) => {
  ctx.body = await quizesService.remove(ctx.params.id);
};
deleteQuiz.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/quizes",
  });

  router.get(
    "/",
    hasPermission(permissions.AdminPerms),
    validate(getAllQuizes.validationScheme),
    getAllQuizes
  );
  router.get(
    "/user/:user_id",
    validate(getAllQuizesFromUser.validationScheme),
    getAllQuizesFromUser
  );
  router.get(
    "/amount/:user_id",
    hasPermission(permissions.AdminPerms),
    validate(getAmountOfQuizes.validationScheme),
    getAmountOfQuizes
  );
  router.get("/:id", validate(getQuizById.validationScheme), getQuizById);
  router.post("/", validate(createQuiz.validationScheme), createQuiz);
  router.put("/:id", validate(updateQuiz.validationScheme), updateQuiz);
  router.delete("/:id", validate(deleteQuiz.validationScheme), deleteQuiz);

  app.use(router.routes()).use(router.allowedMethods());
};
