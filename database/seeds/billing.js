const BILLINGS = [
  {
    id: "00000000-0000-0000-0000-000000000031",
    userId: "00000000-0000-0000-0000-000000000001",
    plan: "PRO",
    status: "ACTIVE",
    billingDate: new Date("2026-03-01T00:00:00Z"),
    amount: "299000.00",
    currency: "IDR",
    invoiceUrl: "https://example.com/invoices/INV-2026-0001",
  },
  {
    id: "00000000-0000-0000-0000-000000000032",
    userId: "00000000-0000-0000-0000-000000000002",
    plan: "BASIC",
    status: "ACTIVE",
    billingDate: new Date("2026-03-01T00:00:00Z"),
    amount: "99000.00",
    currency: "IDR",
    invoiceUrl: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000033",
    userId: "00000000-0000-0000-0000-000000000003",
    plan: "FREE",
    status: "ACTIVE",
    billingDate: null,
    amount: null,
    currency: "IDR",
    invoiceUrl: null,
  },
];

async function seedBillings(prisma) {
  console.log("Seeding billings...");
  for (const data of BILLINGS) {
    const billing = await prisma.billing.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(
      `  ✓ Billing: ${billing.id} (${billing.plan} - ${billing.status})`,
    );
  }
}

module.exports = { seedBillings, BILLINGS };
