const path = require("path");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const { seedUsers } = require("./user");
const { seedProjects } = require("./project");
const { seedLinkSources } = require("./linkSource");
const { seedReviews } = require("./review");
const { seedBillings } = require("./billing");
const { seedRefreshTokens } = require("./refreshToken");
const { seedUserTokens } = require("./userToken");

const result = dotenv.config({ path: path.join(__dirname, "../.env") });

if (result.error) {
  console.error("Failed to load .env file:", result.error);
}

const dbUrl = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...\n");

  // Seed order respects foreign key constraints:
  // users → projects → linkSources → reviews
  //       → billings
  //       → refreshTokens
  //       → userTokens
  await seedUsers(prisma);
  await seedProjects(prisma);
  await seedLinkSources(prisma);
  await seedReviews(prisma);
  await seedBillings(prisma);
  await seedRefreshTokens(prisma);
  await seedUserTokens(prisma);

  console.log("\nDatabase seed completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
