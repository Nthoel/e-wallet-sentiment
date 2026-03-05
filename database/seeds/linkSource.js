const LINK_SOURCES = [
  {
    id: "00000000-0000-0000-0000-000000000021",
    projectId: "00000000-0000-0000-0000-000000000011",
    appName: "DANA",
    playStoreUrl: "https://play.google.com/store/apps/details?id=id.dana",
    isActive: true,
    lastCrawledAt: new Date("2026-03-01T00:00:00Z"),
    createdBy: "00000000-0000-0000-0000-000000000001",
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    projectId: "00000000-0000-0000-0000-000000000011",
    appName: "GoPay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.gojek.app",
    isActive: true,
    lastCrawledAt: new Date("2026-03-01T00:00:00Z"),
    createdBy: "00000000-0000-0000-0000-000000000001",
  },
  {
    id: "00000000-0000-0000-0000-000000000023",
    projectId: "00000000-0000-0000-0000-000000000012",
    appName: "OVO",
    playStoreUrl: "https://play.google.com/store/apps/details?id=ovo.id",
    isActive: true,
    lastCrawledAt: null,
    createdBy: "00000000-0000-0000-0000-000000000002",
  },
];

async function seedLinkSources(prisma) {
  console.log("Seeding link sources...");
  for (const data of LINK_SOURCES) {
    const linkSource = await prisma.linkSource.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(`  ✓ LinkSource: ${linkSource.appName}`);
  }
}

module.exports = { seedLinkSources, LINK_SOURCES };
