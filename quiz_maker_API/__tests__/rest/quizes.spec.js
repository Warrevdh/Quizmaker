const config = require("config");
const { v4: uuidv4 } = require("uuid");

const { withServer } = require("../helpers");

const data = {
  user: {
    data: {
      id: "f92e9960-3f45-4175-ac6a-a8b6cf5f60d8",
      email: config.get("auth.testUser.username"),
      auth0id: config.get("auth.testUser.userId"),
      role: "ADMIN",
    },
  },
  quiz: {
    data: {
      id: "80bf3f5b-866e-4e62-8f1d-dcf57e70eaf6",
      name: "test",
      category: "test",
      description: "test",
      user_id: "f92e9960-3f45-4175-ac6a-a8b6cf5f60d8",
      createdAt: new Date(2022, 1, 1, 1, 1),
    },
  },
  question: {
    data: {
      id: "9578f32e-aeff-4c62-9cbe-f7bc127bc915",
      question: "test",
      answer: "test",
      choice1: "test",
      choice2: "test",
      choice3: "test",
      quiz_id: "80bf3f5b-866e-4e62-8f1d-dcf57e70eaf6",
    },
  },
};

describe("quizes", () => {
  let request;
  let prisma;
  let authHeader;

  withServer(({ prisma: p, request: r, authHeader: a }) => {
    prisma = p;
    request = r;
    authHeader = a;
  });

  const url = "/api/quizes";

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

  describe("GET /api/quizes", () => {
    test("it should 200 and return all quizes", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        allQuizes: [
          {
            category: "test",
            createdAt: "2022-02-01T00:01:00.000Z",
            description: "test",
            id: "80bf3f5b-866e-4e62-8f1d-dcf57e70eaf6",
            name: "test",
            user_id: "f92e9960-3f45-4175-ac6a-a8b6cf5f60d8",
          },
        ],
        count: 1,
        limit: 100,
        offset: 0,
      });
    });
  });

  describe("GET /api/quizes/amount", () => {
    test("it should 200 and return amount of user quizes", async () => {
      const response = await request
        .get(`${url}/amount/f92e9960-3f45-4175-ac6a-a8b6cf5f60d8`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toBe(1);
    });

    test("it should 404 and return user not found", async () => {
      const newId = uuidv4();
      const response = await request
        .get(`${url}/amount/${newId}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        `No quizes found for user with id: ${newId}`
      );
    });
  });

  describe("GET /api/quizes/:id", () => {
    test("it should 200 and return quiz with id 1", async () => {
      const response = await request
        .get(`${url}/${data.quiz.data.id}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        id: data.quiz.data.id,
        name: data.quiz.data.name,
        category: data.quiz.data.category,
        description: data.quiz.data.description,
        user_id: data.quiz.data.user_id,
        createdAt: new Date(2022, 1, 1, 1, 1).toJSON(),
      });
    });

    test("it should 404 and return quiz not found", async () => {
      const newId = uuidv4();
      const response = await request
        .get(`${url}/${newId}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`No quizes found with id: ${newId}`);
    });
  });

  describe("GET /api/quizes/user/:userid", () => {
    test("it should 200 and return all quizes with user id 1", async () => {
      const response = await request
        .get(`${url}/user/${data.user.data.id}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    test("it should 404 and return user not found", async () => {
      const newId = uuidv4();
      const response = await request
        .get(`${url}/user/${newId}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        `No quizes found for user with id: ${newId}`
      );
    });
  });

  describe("POST /api/quizes", () => {
    test("it should 201 and return the created quiz", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          id: "02226c78-1a28-4a01-9a6f-8084e11d1988",
          name: "Test",
          description: "Test",
          category: "Test",
          user_id: "f92e9960-3f45-4175-ac6a-a8b6cf5f60d8",
        });
      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe("Test");
      expect(response.body.description).toBe("Test");
      expect(response.body.category).toBe("Test");
      expect(response.body.user_id).toBe(
        "f92e9960-3f45-4175-ac6a-a8b6cf5f60d8"
      );
    });

    test("it should 400 and return validation error", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          name: "Test",
          description: "Test",
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Validation failed, check details for more information"
      );
    });
  });

  describe("PUT /api/quizes/:id", () => {
    test("it should 200 and return the updated quiz", async () => {
      const response = await request
        .put(`${url}/${data.quiz.data.id}`)
        .set("Authorization", authHeader)
        .send({
          name: "Quiz 1 updated",
          description: "Quiz 1 description updated",
          category: "Quiz 1 category updated",
        });
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(data.quiz.data.id);
      expect(response.body.name).toBe("Quiz 1 updated");
      expect(response.body.description).toBe("Quiz 1 description updated");
      expect(response.body.category).toBe("Quiz 1 category updated");
      expect(response.body.user_id).toBe(data.quiz.data.user_id);
    });

    test("it should 400 and return validation error", async () => {
      const response = await request
        .put(`${url}/${data.quiz.data.id}`)
        .set("Authorization", authHeader)
        .send({
          name: "Quiz 1 updated",
          description: "Quiz 1 description updated",
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Validation failed, check details for more information"
      );
    });
  });

  describe("DELETE /api/quizes/:id", () => {
    beforeAll(async () => {
      await prisma.user.create({
        data: {
          id: "fd81efce-b65e-434f-b1af-f77c7cee4cac",
          email: "test@tester.com",
          auth0id: "auth0|123456789",
        },
      });
      await prisma.quiz.create({
        data: {
          id: "02226c78-1a28-4a01-9a6f-8084e11d1988",
          name: "Test",
          description: "Test",
          category: "Test",
          user_id: "fd81efce-b65e-434f-b1af-f77c7cee4cac",
        },
      });
    });

    test("it should 204 and delete the quiz", async () => {
      const response = await request
        .delete(`${url}/02226c78-1a28-4a01-9a6f-8084e11d1988`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(204);
    });

    test("it should 404 and return quiz not found", async () => {
      const response = await request
        .delete(`${url}/${uuidv4()}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(404);
    });
  });
});
