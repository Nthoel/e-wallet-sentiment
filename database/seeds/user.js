// Plain-text passwords (for development only): Password@123
// Hash generated with bcrypt (10 rounds)
const BCRYPT_HASH =
  "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

const USERS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@example.com",
    username: "admin",
    passwordHash: BCRYPT_HASH,
    role: "ADMIN",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
    lastLoginAt: new Date("2026-03-01T08:00:00Z"),
    isVerified: true,
    verifiedAt: new Date("2026-01-15T12:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "editor@example.com",
    username: "editor",
    passwordHash: BCRYPT_HASH,
    role: "EDITOR",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Editor&background=2ECC71&color=fff",
    lastLoginAt: new Date("2026-02-28T10:00:00Z"),
    isVerified: true,
    verifiedAt: new Date("2026-01-15T12:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "viewer@example.com",
    username: "viewer",
    passwordHash: BCRYPT_HASH,
    role: "VIEWER",
    avatarUrl: null,
    lastLoginAt: null,
    isVerified: false,
    verifiedAt: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    email: "testuser@example.com",
    username: "testuser",
    passwordHash: BCRYPT_HASH,
    role: "EDITOR",
    avatarUrl: null,
    lastLoginAt: null,
    isVerified: false,
    verifiedAt: null,
  },
];

async function seedUsers(prisma) {
  console.log("Seeding users...");
  for (const data of USERS) {
    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(`  ✓ User: ${user.username} (${user.role})`);
  }
}

module.exports = { seedUsers, USERS };
