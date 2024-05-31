const config = require("../config/custom-environment-variables.js");

module.exports = {
  log: {
    level: "silly",
    disabled: true,
  },
  cors: {
    origins: ["http://localhost:3000"],
    maxAge: 3 * 60 * 60,
  },
  pagination: {
    limit: 100,
    offset: 0,
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: config.JWT_SECRET,
      expirationInterval: 60 * 60 * 1000,
      issuer: "quizmaker.com",
      audience: "quizmaker.com",
    },
  },
};
