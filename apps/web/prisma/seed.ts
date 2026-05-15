import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const category = await prisma.category.create({
    data: {
      slug: "outerwear",
      name: "Outerwear",
    },
  });

  // Seed products
  const product1 = await prisma.product.create({
    data: {
      slug: "velvet-obsidian-blazer",
      sku: "LV-BLZ-001",
      name: "Velvet Obsidian Blazer",
      description:
        "Hand-tailored from the finest velvet, this blazer exemplifies understated luxury with its midnight obsidian hue.",
      price: 2450.0,
      compareAtPrice: 2800.0,
      status: "ACTIVE",
      featured: true,
    },
  });

  await prisma.productImage.createMany({
    data: [
      {
        productId: product1.id,
        url: "https://images.unsplash.com/photo-1598525418864-e36c818e8489?w=800",
        altText: "Velvet Obsidian Blazer front view",
        width: 800,
        height: 1066,
        isPrimary: true,
      },
    ],
  });

  await prisma.productVariant.createMany({
    data: [
      {
        productId: product1.id,
        sku: "LV-BLZ-001-S",
        name: "Small / Obsidian",
        size: "S",
        color: "Obsidian",
        colorHex: "#1a1a2e",
        price: 2450.0,
        inventory: 3,
      },
      {
        productId: product1.id,
        sku: "LV-BLZ-001-M",
        name: "Medium / Obsidian",
        size: "M",
        color: "Obsidian",
        colorHex: "#1a1a2e",
        price: 2450.0,
        inventory: 5,
      },
    ],
  });

  const product2 = await prisma.product.create({
    data: {
      slug: "cashmere-meridian-coat",
      sku: "LV-COA-002",
      name: "Cashmere Meridian Coat",
      description:
        "Luxurious cashmere in warm meridian tones. A timeless silhouette for the modern connoisseur.",
      price: 3800.0,
      status: "ACTIVE",
      featured: true,
    },
  });

  await prisma.productImage.createMany({
    data: [
      {
        productId: product2.id,
        url: "https://images.unsplash.com/photo-1539533115957-87e7a98e1ce3?w=800",
        altText: "Cashmere Meridian Coat front view",
        width: 800,
        height: 1066,
        isPrimary: true,
      },
    ],
  });

  await prisma.productVariant.createMany({
    data: [
      {
        productId: product2.id,
        sku: "LV-COA-002-M",
        name: "Medium / Meridian",
        size: "M",
        color: "Meridian",
        colorHex: "#8b6914",
        price: 3800.0,
        inventory: 2,
      },
    ],
  });

  console.log(`Seeded ${2} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
