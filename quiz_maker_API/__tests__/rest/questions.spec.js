const config = require("config");
const { v4: uuidv4 } = require("uuid");

const { withServer } = require("../helpers");

const data = {
  user: {
    data: {
      id: "a0cf76fc-0287-4615-a626-f1bb938d109c",
      email: config.get("auth.testUser.username"),
      auth0id: config.get("auth.testUser.userId"),
      role: "ADMIN",
    },
  },
  quiz: {
    data: {
      id: "0d84efd3-f7b0-4706-8df5-749eb82f60f2",
      name: "test",
      category: "test",
      description: "test",
      user_id: "a0cf76fc-0287-4615-a626-f1bb938d109c",
      createdAt: new Date(2022, 1, 1, 1, 1),
    },
  },
  question: {
    data: {
      id: "0d84efd3-f7b0-4706-8df5-749eb82f60f2",
      question: "test",
      answer: "test",
      choice1: "test",
      choice2: "test",
      choice3: "test",
      quiz_id: "0d84efd3-f7b0-4706-8df5-749eb82f60f2",
    },
  },
};

describe("questions", () => {
  let request;
  let prisma;
  let authHeader;

  withServer(({ prisma: p, request: r, authHeader: a }) => {
    prisma = p;
    request = r;
    authHeader = a;
  });

  const url = "/api/questions";

  beforeEach(async () => {
    await prisma.user.create(data.user);
    await prisma.quiz.create(data.quiz);
    await prisma.question.create(data.question);
  });

  afterEach(async () => {
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("GET /api/questions/:id", () => {
    test("it should 200 return a questions", async () => {
      const response = await request
        .get(`${url}/0d84efd3-f7b0-4706-8df5-749eb82f60f2`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(data.question.data);
    });

    test("it should return 404 if question does not exist", async () => {
      const response = await request
        .get(`${url}/${uuidv4()}`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("GET /api/questions/quiz/:quiz_id", () => {
    test("it should 200 and return all questions that belong to a quiz", async () => {
      const response = await request
        .get(`${url}/quiz/0d84efd3-f7b0-4706-8df5-749eb82f60f2`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([data.question.data]);
    });

    test("it should 404 if quiz does not exist", async () => {
      const newId = uuidv4();
      const response = await request
        .get(`${url}/quiz/${newId}`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("POST /api/questions", () => {
    test("it should 201 and create a question", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          question: "test",
          answer: "test",
          choice1: "test",
          choice2: "test",
          choice3: "test",
          quiz_id: "0d84efd3-f7b0-4706-8df5-749eb82f60f2",
        });
      expect(response.status).toEqual(201);
      expect(response.body[0].id).toBeTruthy();
      expect(response.body[0].question).toEqual("test");
      expect(response.body[0].answer).toEqual("test");
      expect(response.body[0].choice1).toEqual("test");
      expect(response.body[0].choice2).toEqual("test");
      expect(response.body[0].choice3).toEqual("test");
      expect(response.body[0].quiz_id).toEqual(
        "0d84efd3-f7b0-4706-8df5-749eb82f60f2"
      );
    });

    test("it should 404 if quiz does not exist", async () => {
      const newId = uuidv4();
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          question: "test",
          answer: "test",
          choice1: "test",
          choice2: "test",
          choice3: "test",
          quiz_id: newId,
        });
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe("No quiz found with id: " + newId);
    });
  });

  describe("PUT /api/questions/:id", () => {
    test("it should 200 and update a question", async () => {
      const response = await request
        .put(`${url}/0d84efd3-f7b0-4706-8df5-749eb82f60f2`)
        .set("Authorization", authHeader)
        .send({
          question: "test2",
          answer: "test2",
          choice1: "test2",
          choice2: "test2",
          choice3: "test2",
        });
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual("0d84efd3-f7b0-4706-8df5-749eb82f60f2");
      expect(response.body.question).toEqual("test2");
      expect(response.body.answer).toEqual("test2");
      expect(response.body.choice1).toEqual("test2");
      expect(response.body.choice2).toEqual("test2");
      expect(response.body.choice3).toEqual("test2");
    });

    test("it should 404 if question does not exist", async () => {
      const newId = uuidv4();
      const response = await request
        .put(`${url}/${newId}`)
        .set("Authorization", authHeader)
        .send({
          question: "test2",
          answer: "test2",
          choice1: "test2",
          choice2: "test2",
          choice3: "test2",
        });
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe("No question found with id: " + newId);
    });
  });

  describe("DELETE /api/questions/quiz/:quiz_id", () => {
    test("it should 200 and delete all questions that belong to a quiz", async () => {
      const response = await request
        .delete(`${url}/quiz/0d84efd3-f7b0-4706-8df5-749eb82f60f2`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ count: 1 });
    });

    test("it should 404 if quiz does not exist", async () => {
      const newId = uuidv4();
      const response = await request
        .delete(`${url}/quiz/${newId}`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe("No quiz found with id: " + newId);
    });
  });

  describe("DELETE /api/questions/:id", () => {
    test("it should 200 and delete a question", async () => {
      const response = await request
        .delete(`${url}/0d84efd3-f7b0-4706-8df5-749eb82f60f2`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        answer: "test",
        choice1: "test",
        choice2: "test",
        choice3: "test",
        id: "0d84efd3-f7b0-4706-8df5-749eb82f60f2",
        question: "test",
        quiz_id: "0d84efd3-f7b0-4706-8df5-749eb82f60f2",
      });
    });

    test("it should 404 if question does not exist", async () => {
      const newId = uuidv4();
      const response = await request
        .delete(`${url}/${newId}`)
        .set("Authorization", authHeader);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe("No question found with id: " + newId);
    });
  });
});
