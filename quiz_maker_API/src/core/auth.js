const jwksrsa = require("jwks-rsa");
const jwt = require("koa-jwt");
const config = require("config");

const { getLogger } = require("../core/logger.js");

function getJwtSecret() {
  try {
    let secretFunction = jwksrsa.koaJwtSecret({
      jwksUri: config.get("auth.jwksUri"),
      cache: true,
      cacheMaxEntries: 5,
    });
    return secretFunction;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function checkJwtToken() {
  try {
    let secretFunction = getJwtSecret();
    return jwt({
      secret: secretFunction,
      audience: config.get("auth.audience"),
      issuer: config.get("auth.issuer"),
      algorithms: ["RS256"],
      passthrough: true,
    });   
  } catch (error) {
    const logger = getLogger();
    logger.error(error);
    throw error;
  }
}

const permissions = Object.freeze({
  AdminPerms: "AdminPerms",
});

function hasPermission(permission) {
  return async (ctx, next) => {
    const logger = getLogger();
    const user = ctx.state.user;
    logger.debug(`hasPermission: ${JSON.stringify(user)}`);

    if (user && user.permissions && user.permissions.includes(permission)) {
      await next();
    } else {
      ctx.throw(
        403,
        "You are not allowed to view this part of the application",
        {
          code: "FORBIDDEN",
        }
      );
    }
  };
}

module.exports = {
  checkJwtToken,
  hasPermission,
  permissions,
};
