// tokenHash adalah SHA-256 dari refresh token (placeholder untuk keperluan seed)
const REFRESH_TOKENS = [
  {
    id: "00000000-0000-0000-0000-000000000041",
    userId: "00000000-0000-0000-0000-000000000001",
    tokenHash:
      "a3f8c1d2e4b5a6f7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
    deviceInfo: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ipAddress: "192.168.1.10",
    isRevoked: false,
    expiresAt: new Date("2026-04-01T00:00:00Z"),
    revokedAt: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000042",
    userId: "00000000-0000-0000-0000-000000000002",
    tokenHash:
      "b4e9d3f5a7c8b0d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    deviceInfo: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    ipAddress: "10.0.0.5",
    isRevoked: false,
    expiresAt: new Date("2026-04-01T00:00:00Z"),
    revokedAt: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000043",
    userId: "00000000-0000-0000-0000-000000000001",
    tokenHash:
      "c5f0e4a6b8d9c1e3f2a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8",
    deviceInfo: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    ipAddress: "172.16.0.20",
    isRevoked: true,
    expiresAt: new Date("2026-03-01T00:00:00Z"),
    revokedAt: new Date("2026-02-28T12:00:00Z"),
  },
];

async function seedRefreshTokens(prisma) {
  console.log("Seeding refresh tokens...");
  for (const data of REFRESH_TOKENS) {
    const token = await prisma.refreshToken.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(`  ✓ RefreshToken: ${token.id} (revoked: ${token.isRevoked})`);
  }
}

module.exports = { seedRefreshTokens, REFRESH_TOKENS };
