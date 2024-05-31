const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const ServiceError = require("../core/serviceError.js");
const { getChildLogger } = require("../core/logger.js");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getById = async (id) => {
  debugLog("Fetching question by id", { id });
  const question = await getPrisma().question.findUnique({
    where: {
      id: id,
    },
  });
  if (!question)
    throw ServiceError.notFound(`No question found with id: ${id}`, { id });

  return question;
};

const getByQuizId = async (quizId) => {
  debugLog("Fetching question by quiz id", { quizId });
  const questions = await getPrisma().question.findMany({
    where: {
      quiz_id: quizId,
    },
  });
  if (questions.length === 0 || !questions)
    throw ServiceError.notFound(
      `No questions found for quiz with id: ${quizId}`,
      {
        quizId,
      }
    );
  return questions;
};

const create = async ({
  quiz_id,
  question,
  answer,
  choice1,
  choice2,
  choice3,
}) => {
  debugLog("Creating new question", {
    quiz_id,
    question,
    answer,
    choice1,
    choice2,
    choice3,
  });
  try {
    const quiz = await getPrisma().quiz.findUnique({
      where: {
        id: quiz_id,
      },
    });
    if (!quiz)
      throw ServiceError.notFound(`No quiz found with id: ${quiz_id}`, {
        quiz_id,
      });
    const newQuestion = await getPrisma().question.create({
      data: {
        quiz_id,
        question,
        answer,
        choice1,
        choice2,
        choice3,
      },
    });
    return await getByQuizId(newQuestion.quiz_id);
  } catch (error) {
    const logger = getChildLogger("question-repo");
    logger.error("Error in create", { error });
    throw error;
  }
};

const updateById = async (
  id,
  { question, answer, choice1, choice2, choice3 }
) => {
  debugLog("Updating question", {
    id,
    question,
    answer,
    choice1,
    choice2,
    choice3,
  });
  try {
    const questionCheck = await getPrisma().question.findUnique({
      where: {
        id: id,
      },
    });
    if (!questionCheck)
      throw ServiceError.notFound(`No question found with id: ${id}`, { id });

    const item = await getPrisma().question.update({
      where: {
        id: id,
      },
      data: {
        question,
        answer,
        choice1,
        choice2,
        choice3,
      },
    });
    return await getById(item.id);
  } catch (error) {
    const logger = getChildLogger("question-repo");
    logger.error("Error in update", { error });
    throw error;
  }
};

const deleteById = async (id) => {
  debugLog("Deleting question by id", { id });
  try {
    const questionCheck = await getPrisma().question.findUnique({
      where: {
        id: id,
      },
    });
    if (!questionCheck)
      throw ServiceError.notFound(`No question found with id: ${id}`, { id });
    const deleted = await getPrisma().question.delete({
      where: {
        id: id,
      },
    });
    return deleted;
  } catch (error) {
    const logger = getChildLogger("question-repo");
    logger.error("Error in delete", { error });
    throw error;
  }
};

const deleteByQuizId = async (quizId) => {
  debugLog("Deleting question by quiz id", { quizId });
  try {
    const quizCheck = await getPrisma().quiz.findUnique({
      where: {
        id: quizId,
      },
    });
    if (!quizCheck)
      throw ServiceError.notFound(`No quiz found with id: ${quizId}`, {
        quizId,
      });
    const deleted = await getPrisma().question.deleteMany({
      where: {
        quiz_id: quizId,
      },
    });
    return deleted;
  } catch (error) {
    const logger = getChildLogger("question-repo");
    logger.error("Error in delete", { error });
    throw error;
  }
};

module.exports = {
  getByQuizId,
  getById,
  create,
  updateById,
  deleteById,
  deleteByQuizId,
};
