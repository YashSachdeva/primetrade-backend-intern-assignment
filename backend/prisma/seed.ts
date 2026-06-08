import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@primetrade.ai" },
    update: {},
    create: {
      name: "Primetrade Admin",
      email: "admin@primetrade.ai",
      passwordHash,
      role: Role.ADMIN
    }
  });

  await prisma.product.createMany({
    data: [
      {
        name: "BTC Momentum Signal",
        description: "Premium trading-intelligence signal pack for Bitcoin momentum analysis.",
        price: 49.99,
        stock: 100
      },
      {
        name: "ETH Volatility Monitor",
        description: "Dashboard-ready volatility insights for Ethereum markets.",
        price: 39.99,
        stock: 80
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
