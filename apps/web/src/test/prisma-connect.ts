/**
 * Prisma Connection Test
 * Run: npx tsx src/test/prisma-connect.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Testing Prisma connection...");

  try {
    // Test 1: Raw query to verify connectivity
    const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
    console.log("✅ Prisma connection successful:", result);

    // Test 2: List existing tables
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log("📋 Existing tables:", tables);

    // Test 3: Verify migrations table exists (indicates schema is initialized)
    const migrations = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "_prisma_migrations"
    `;
    console.log("📋 Prisma migrations count:", migrations);

    console.log("\n✅ All Prisma tests passed!");
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
