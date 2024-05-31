const Joi = require("joi");
const Router = require("@koa/router");

const questionsService = require("../service/question.js");

const validate = require("./validation.js");

const getById = async (ctx) => {
  ctx.body = await questionsService.getById(ctx.params.id);
};
getById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const createQuestion = async (ctx) => {
  ctx.body = await questionsService.create(ctx.request.body);
  ctx.status = 201;
};
createQuestion.validationScheme = {
  body: {
    question: Joi.string().max(255),
    answer: Joi.string().max(255),
    choice1: Joi.string().max(255),
    choice2: Joi.string().empty("").optional(),
    choice3: Joi.string().empty("").optional(),
    quiz_id: Joi.string().uuid(),
  },
};

const getQuestionsByQuizId = async (ctx) => {
  ctx.body = await questionsService.getByQuizId(ctx.params.quiz_id);
};
getQuestionsByQuizId.validationScheme = {
  params: {
    quiz_id: Joi.string().uuid(),
  },
};

const updateQuestion = async (ctx) => {
  ctx.body = await questionsService.updateById(ctx.params.id, ctx.request.body);
};
updateQuestion.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    question: Joi.string().max(255),
    answer: Joi.string().max(255),
    choice1: Joi.string().max(255),
    choice2: Joi.string().empty("").optional(),
    choice3: Joi.string().empty("").optional(),
  },
};

const deleteQuestion = async (ctx) => {
  ctx.body = await questionsService.deleteById(ctx.params.id);
};
deleteQuestion.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const deleteQuestionByQuizId = async (ctx) => {
  ctx.body = await questionsService.deleteByQuizId(ctx.params.quiz_id);
};
deleteQuestionByQuizId.validationScheme = {
  params: {
    quiz_id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/questions",
  });
  router.get("/:id", validate(getById.validationScheme), getById);
  router.get(
    "/quiz/:quiz_id",
    validate(getQuestionsByQuizId.validationScheme),
    getQuestionsByQuizId
  );
  router.post("/", validate(createQuestion.validationScheme), createQuestion);
  router.put("/:id", validate(updateQuestion.validationScheme), updateQuestion);
  router.delete(
    "/quiz/:quiz_id",
    validate(deleteQuestionByQuizId.validationScheme),
    deleteQuestionByQuizId
  );
  router.delete(
    "/:id",
    validate(deleteQuestion.validationScheme),
    deleteQuestion
  );

  app.use(router.routes()).use(router.allowedMethods());
};
