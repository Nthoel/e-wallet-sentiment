const PROJECTS = [
  {
    id: "00000000-0000-0000-0000-000000000011",
    userId: "00000000-0000-0000-0000-000000000001",
    projectName: "E-Wallet Indonesia Sentiment Analysis",
    description:
      "Analisis sentimen ulasan pengguna e-wallet populer di Indonesia (DANA, GoPay, OVO).",
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    userId: "00000000-0000-0000-0000-000000000002",
    projectName: "Riset Kompetitor Fintech",
    description:
      "Monitoring ulasan dan sentimen pengguna aplikasi fintech kompetitor.",
  },
];

async function seedProjects(prisma) {
  console.log("Seeding projects...");
  for (const data of PROJECTS) {
    const project = await prisma.project.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(`  ✓ Project: ${project.projectName}`);
  }
}

module.exports = { seedProjects, PROJECTS };
