const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const register = async ({ auth0id, email, username }) => {
  debugLog("Creating a new user", { email, auth0id, username });
  try {
    const user = await getPrisma().user.create({
      data: {
        auth0id,
        email,
        username,
      },
    });
    return user;
  } catch (error) {
    const logger = getChildLogger("user-repo");
    logger.error("Error in create", { error });
    throw error;
  }
};

const getAll = async (limit = 100, offset = 0) => {
  debugLog("Fetching all users", { limit, offset });
  const data = await getPrisma().user.findMany({
    orderBy: {
      username: "asc",
    },
  });
  const count = data.length;
  return {
    data,
    count,
    limit,
    offset,
  };
};

const getById = async (id) => {
  debugLog(`Fetching user by id ${id}`);
  const user = await getPrisma().user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user)
    throw ServiceError.notFound(`User with id ${id} not found`, { id });
  return user;
};

const getByAuth0Id = async (auth0id) => {
  debugLog("Fetching user by auth0_id", { auth0id });
  const user = await getPrisma().user.findUnique({
    where: {
      auth0id: auth0id,
    },
  });
  if (!user) {
    throw ServiceError.notFound(`User with auth0id ${auth0id} not found`, {
      auth0id,
    });
  }
  return user;
};

const updateById = async (id, { username, email }) => {
  debugLog("Updating user by id", { id, username, email });
  try {
    const item = await getPrisma().user.update({
      where: {
        id: id,
      },
      data: {
        username,
        email,
      },
    });
    return await getById(item.id);
  } catch (error) {
    const logger = getChildLogger("user-repo");
    logger.error("Error in update", { error });
    throw error;
  }
};

const deleteById = async (id) => {
  debugLog("Deleting user by id", { id });
  try {
    const rowsAffected = await getPrisma().user.delete({
      where: {
        id: id,
      },
    });
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger("user-repo");
    logger.error("Error in delete", { error });
    throw ServiceError.notFound(`User with id ${id} not found`, { id });
  }
};

const updateUserRole = async (id, { role }) => {
  debugLog("Updating user role by id", { id, role });
  try {
    const item = await getPrisma().user.update({
      where: {
        id: id,
      },
      data: {
        role,
      },
    });
    return await getById(item.id);
  } catch (error) {
    const logger = getChildLogger("user-repo");
    logger.error("Error in update", { error });
    throw error;
  }
};

module.exports = {
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  getByAuth0Id,
  updateUserRole,
};
