describe("Create, edit and delete a quiz", () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it("create quiz test", () => {
    cy.visit("http://localhost:3000/quiz/create");

    cy.get("[data-cy=quizNameInput]").type("Test Quiz");
    cy.get("[data-cy=quizDescriptionInput]").type("Test Quiz Description");
    cy.get("[data-cy=quizCategorySelect]").select("Videospellen");
    cy.get("[data-cy=questionInput]").type("Test Question");
    cy.get("[data-cy=answerInput]").type("Test Answer");
    cy.get("[data-cy=choice1Input]").type("Test Choice 1");
    cy.get("[data-cy=choice2Input]").type("Test Choice 2");
    cy.get("[data-cy=choice3Input]").type("Test Choice 3");
    cy.get("[data-cy=submit]").click();
    cy.get("[data-cy=modalOkBtn]").click();
  });

  it("check if quiz is created", () => {
    cy.visit("http://localhost:3000/myquizes");

    cy.get("[data-cy=quizTitle]").should("contain", "Test Quiz");
    cy.get("[data-cy=quizDescription]").should(
      "contain",
      "Test Quiz Description"
    );
    cy.get("[data-cy=quizCategory]").should("contain", "Videospellen");
    cy.get("[data-cy=quizFooter]").should(
      "contain",
      new Date().toLocaleDateString("nl-NL")
    );
  });

  it("edit quiz test", () => {
    cy.visit("http://localhost:3000/myquizes");

    cy.get("[data-cy=editQuizBtn]").click();
    cy.get("[data-cy=quizNameInput]").clear().type("Edited Quiz");
    cy.get("[data-cy=quizDescriptionInput]")
      .clear()
      .type("Edited Quiz Description");
    cy.get("[data-cy=quizCategorySelect]").select("Politiek");
    cy.get("[data-cy=questionInput]").clear().type("Edited Question");
    cy.get("[data-cy=answerInput]").clear().type("Edited Answer");
    cy.get("[data-cy=choice1Input]").clear().type("Edited Choice 1");
    cy.get("[data-cy=choice2Input]").clear().type("Edited Choice 2");
    cy.get("[data-cy=choice3Input]").clear().type("Edited Choice 3");

    cy.get("[data-cy=submit]").click();
    cy.get("[data-cy=modalOkBtn]").click();
  });

  it("check if quiz is edited", () => {
    cy.visit("http://localhost:3000/myquizes");

    cy.get("[data-cy=quizTitle]").should("contain", "Edited Quiz");
    cy.get("[data-cy=quizDescription]").should(
      "contain",
      "Edited Quiz Description"
    );
    cy.get("[data-cy=quizCategory]").should("contain", "Politiek");
    cy.get("[data-cy=quizFooter]").should(
      "contain",
      new Date().toLocaleDateString("nl-NL")
    );
  });

  it("delete quiz test", () => {
    cy.visit("http://localhost:3000/myquizes");

    cy.get("[data-cy=quizDelete]").click();
    cy.get("[data-cy=confirmDeleteQuiz]").click();
  });

  it("check if quiz is deleted", () => {
    cy.visit("http://localhost:3000/myquizes");

    cy.get("[data-cy=quizCard]").should("not.exist");
  });
});
