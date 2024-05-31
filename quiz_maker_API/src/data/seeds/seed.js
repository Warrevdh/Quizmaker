const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: "638615f5aeb9ecac4016ac8e" },
    update: {},
    create: {
      id: "638615f5aeb9ecac4016ac8e",
      username: "Warre",
      auth0id: "auth0|638615f5aeb9ecac4016ac8e",
      email: "warrevandenhoucke@hotmail.com",
      role: "ADMIN",
      quiz: {
        create: {
          name: "Coole wiskunde quiz",
          description: "Coole wiskunde quiz met moeilijke vragen",
          category: "Wiskunde",
          question: {
            createMany: {
              data: [
                {
                  question: "5+5?",
                  answer: "10",
                  choice1: "55",
                  choice2: "100",
                  choice3: "9",
                },
                {
                  question: "6+6?",
                  answer: "12",
                  choice1: "66",
                  choice2: "100",
                },
                {
                  question: "4+4?",
                  answer: "8",
                  choice1: "44",
                },
              ],
            },
          },
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
