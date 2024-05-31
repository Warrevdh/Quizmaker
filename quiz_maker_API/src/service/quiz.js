const config = require("config");

const ServiceError = require("../core/serviceError");
const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all quizes");
  const allQuizes = await getPrisma().quiz.findMany();
  const count = allQuizes.length;
  return { allQuizes, count, limit, offset };
};

const getAllFromUser = async (user_id) => {
  debugLog("Fetching all quizes from user");
  const items = await getPrisma().quiz.findMany({
    where: {
      user_id,
    },
  });
  if (items.length === 0)
    throw ServiceError.notFound(
      `No quizes found for user with id: ${user_id}`,
      {
        user_id,
      }
    );
  return items;
};

const getAmountOfQuizesFromUser = async (user_id) => {
  debugLog("Fetching amount of quizes");
  const amount = await getAllFromUser(user_id);
  if (!amount)
    throw ServiceError.notFound(
      `No quizes found for user with id: ${user_id}`,
      { user_id }
    );
  return amount.length;
};

const getById = async (id) => {
  debugLog(`Fetching quiz with id: ${id}`);
  const quiz = await getPrisma().quiz.findUnique({
    where: {
      id: id,
    },
  });
  if (!quiz)
    throw ServiceError.notFound(`No quizes found with id: ${id}`, {
      id,
    });
  return quiz;
};

const create = async ({ id, description, category, name, user_id }) => {
  debugLog("Creating new quiz", { id, description, category, name, user_id });
  try {
    const item = await getPrisma().quiz.create({
      data: {
        id,
        description,
        category,
        name,
        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });
    return await getById(item.id);
  } catch (error) {
    const logger = getChildLogger("quiz-repo");
    logger.error("Error in create", { error });
    throw error;
  }
};

const update = async (id, { description, category, name, userid }) => {
  debugLog(`Updating quiz with id: ${id}`, {
    description,
    category,
    name,
    userid,
  });
  try {
    const item = await getPrisma().quiz.update({
      where: {
        id: id,
      },
      data: {
        description: description,
        category: category,
        name: name,
        user_id: userid,
      },
    });
    return await getById(item.id);
  } catch (error) {
    const logger = getChildLogger("quiz-repo");
    logger.error("Error in updateById", { error });
    throw error;
  }
};

const remove = async (id) => {
  debugLog(`Removing quiz with id: ${id}`);
  try {
    await getPrisma().quiz.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw ServiceError.notFound(`No quiz found with id: ${id}`, { id });
  }
};

module.exports = {
  getAll,
  getAllFromUser,
  getAmountOfQuizesFromUser,
  getById,
  create,
  update,
  remove,
};
