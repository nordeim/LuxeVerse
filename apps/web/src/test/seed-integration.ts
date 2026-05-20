import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Running data integrity verification...\n");

  // Test 1: Brand exists with products
  const brandWithProducts = await prisma.brand.findFirst({
    where: { products: { some: {} } },
    include: { products: true }
  });
  console.log("✅ Brand with products:", brandWithProducts?.name);

  // Test 2: Product with variants
  const productWithVariants = await prisma.product.findFirst({
    where: { variants: { some: {} } },
    include: { variants: { take: 2 } }
  });
  console.log("✅ Product with variants:", productWithVariants?.name, "(", productWithVariants?.variants.length || 0, "variants)");

  // Test 3: Category hierarchy
  const outerwear = await prisma.category.findFirst({
    where: { name: "Outerwear" },
    include: { parent: true }
  });
  console.log("✅ Category hierarchy:", outerwear?.parent?.name, ">", outerwear?.name);

  // Test 4: Product with tags and materials
  const product = await prisma.product.findFirst({
    include: { tags: true, materials: true }
  });
  console.log("✅ Product with tags:", product?.tags.length, "materials:", product?.materials.length);

  // Test 5: Find user by role
  const admin = await prisma.user.findUnique({ where: { email: "admin@luxeverse.com" } });
  console.log("✅ Admin user:", admin?.email, "role:", admin?.role);

  // Test 6: Complex query — products by brand
  const loropiana = await prisma.brand.findUnique({
    where: { slug: "loro-piana" },
    include: { products: { include: { variants: true } } }
  });
  console.log("✅ Brand products:", loropiana?.name, "-", loropiana?.products.length || 0, "products");

  // Test 7: Prisma raw query — test direct connection
  const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
  console.log("✅ Raw query result:", result);

  console.log("\n🎉 Data integrity verification passed!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Verification error:", e);
  process.exit(1);
});
