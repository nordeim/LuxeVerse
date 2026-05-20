import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [brands, products, users, categories, tags, materials, reviews, appointments] = await Promise.all([
    prisma.brand.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.material.count(),
    prisma.review.count(),
    prisma.appointment.count(),
  ]);

  const variants = await prisma.productVariant.count();
  const collections = await prisma.collection.count();
  const pages = await prisma.cMSPage.count();
  const editorials = await prisma.editorial.count();
  const returns = await prisma.return.count();

  console.log("📊 Database Seed Summary:");
  console.log("========================");
  console.log(`Brands:      ${brands}`);
  console.log(`Products:    ${products} (${variants} variants)`);
  console.log(`Users:       ${users}`);
  console.log(`Categories:  ${categories}`);
  console.log(`Tags:        ${tags}`);
  console.log(`Materials:   ${materials}`);
  console.log(`Reviews:     ${reviews}`);
  console.log(`Appointments: ${appointments}`);
  console.log(`Collections: ${collections}`);
  console.log(`CMS Pages:   ${pages}`);
  console.log(`Editorials:  ${editorials}`);
  console.log(`Returns:     ${returns}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Verification error:", e);
  process.exit(1);
});
