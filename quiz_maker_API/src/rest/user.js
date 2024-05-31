const Router = require("@koa/router");
const Joi = require("joi");
const axios = require("axios");
const config = require("config");

const { getLogger } = require("../core/logger");
const { hasPermission, permissions } = require("../core/auth");
const userService = require("../service/user");
const AUTH_USER_INFO = config.get("auth.userInfo");

const validate = require("./validation.js");

async function addUserInfo(ctx) {
  const logger = getLogger();
  try {
    const token = ctx.headers.authorization;
    const url = AUTH_USER_INFO;
    if (token && url && ctx.state.user) {
      logger.debug(`addUserInfo: ${url}, ${JSON.stringify(token)}`);
      const userInfo = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      ctx.state.user = {
        ...ctx.state.user,
        ...userInfo.data,
      };
    }
  } catch (error) {
    logger.error("Something went wrong when fetching user info", { error });
    throw error;
  }
}

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset)
  );
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().max(1000).optional(),
    offset: Joi.number().min(0).optional(),
  }).and("limit", "offset"),
};

const getUserById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const getByAuth0Id = async (ctx) => {
  ctx.body = await userService.getByAuth0Id(ctx.params.auth0id);
};
getByAuth0Id.validationScheme = {
  params: {
    auth0id: Joi.string(),
  },
};

const registerUser = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
};
registerUser.validationScheme = {
  body: {
    username: Joi.string().max(255),
    email: Joi.string().email(),
    auth0id: Joi.string(),
  },
};

const updateUser = async (ctx) => {
  let userId = 0;
  try {
    const user = await userService.getByAuth0Id(ctx.state.user.sub);
    userId = user.id;
    ctx.body = await userService.updateById(userId, ctx.request.body);
  } catch (err) {
    await addUserInfo(ctx);
    ctx.body = await userService.register({
      auth0id: ctx.state.user.sub,
      username: ctx.state.user.nickname,
      email: ctx.state.user.email,
    });
  }
};
updateUser.validationScheme = {
  body: {
    username: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const updateUserRole = async (ctx) => {
  const user = await userService.updateUserRole(
    ctx.params.id,
    ctx.request.body
  );
  ctx.body = user;
};
updateUserRole.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    role: Joi.string(),
  },
};

const checkRole = async (ctx) => {
  const user = await userService.getByAuth0Id(ctx.state.user.sub);
  ctx.body = user.role;
};
checkRole.validationScheme = {};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/users",
  });

  router.get(
    "/",
    hasPermission(permissions.AdminPerms),
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get("/:id", validate(getUserById.validationScheme), getUserById);
  router.get(
    "/auth0id/:auth0id",
    validate(getByAuth0Id.validationScheme),
    getByAuth0Id
  );
  router.get("/role/check", validate(checkRole.validationScheme), checkRole);
  router.put(
    "/role/:id",
    hasPermission(permissions.AdminPerms),
    validate(updateUserRole.validationScheme),
    updateUserRole
  );
  router.post("/", validate(updateUser.validationScheme), updateUser);
  router.delete(
    "/:id",
    validate(deleteUserById.validationScheme),
    deleteUserById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
