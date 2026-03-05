// tokenHash adalah SHA-256 dari token/kode verifikasi (placeholder untuk keperluan seed)
const USER_TOKENS = [
  {
    id: "00000000-0000-0000-0000-000000000051",
    userId: "00000000-0000-0000-0000-000000000002",
    type: "EMAIL_VERIFICATION",
    tokenHash:
      "d6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    isUsed: false,
    ipAddress: "10.0.0.5",
    expiresAt: new Date("2026-03-10T00:00:00Z"),
    usedAt: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000052",
    userId: "00000000-0000-0000-0000-000000000003",
    type: "EMAIL_VERIFICATION",
    tokenHash:
      "e7b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    isUsed: true,
    ipAddress: "10.0.0.6",
    expiresAt: new Date("2026-03-08T00:00:00Z"),
    usedAt: new Date("2026-03-06T09:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0000-000000000053",
    userId: "00000000-0000-0000-0000-000000000001",
    type: "PASSWORD_RESET",
    tokenHash:
      "f8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    isUsed: false,
    ipAddress: "192.168.1.10",
    expiresAt: new Date("2026-03-06T18:00:00Z"),
    usedAt: null,
  },
];

async function seedUserTokens(prisma) {
  console.log("Seeding user tokens...");
  for (const data of USER_TOKENS) {
    const token = await prisma.userToken.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(
      `  ✓ UserToken: ${token.id} (${token.type} - used: ${token.isUsed})`,
    );
  }
}

module.exports = { seedUserTokens, USER_TOKENS };
