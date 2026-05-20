import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// SEED DATA — Luxury E-Commerce Development Dataset
// ---------------------------------------------------------------------------

const BRANDS = [
  {
    slug: "loro-piana", name: "Loro Piana",
    description: "Italian luxury house crafting the world's finest cashmere and wool since 1924.",
    story: "In the highlands of Peru and Mongolia, Loro Piana scouts the world's rarest fibers. Each Vicuna coat represents over 40 hours of hand-finishing. The brand's commitment to traceable sourcing and zero-waste pattern-making defines modern luxury.",
    country: "IT", heritage: "Established in Trivero, 1924 by Pietro Loro Piana",
  },
  {
    slug: "brunello-cucinelli", name: "Brunello Cucinelli",
    description: "Umbrian philosophy of humanistic capitalism woven into every garment.",
    story: "In 1978, Brunello Cucinelli revived cast cashmere in a Solomeo workshop. Today, his workers earn above-market wages with two-hour lunch breaks. Each garment carries the 'Made in Solomeo' label—the village itself has become the brand.",
    country: "IT", heritage: "Founded in Solomeo, 1978",
  },
  {
    slug: "bottega-veneta", name: "Bottega Veneta",
    description: "When your own initials are enough. Quiet luxury through Italian leather mastery.",
    story: "Founded in 1966 in Vicenza, Bottega Veneta's Intrecciato weaving technique was born out of necessity—industrial looms couldn't handle supple leather. Today, a single Cabat bag requires two artisans and 48 hours.",
    country: "IT", heritage: "Founded in Vicenza, 1966",
  },
  {
    slug: "hermes", name: "Hermès",
    description: "French saddler turned luxury legend. handcrafted since 1837.",
    story: "Thierry Hermès opened his harness workshop in Paris in 1837. Each Kelly bag still requires 18-25 hours of hand-stitching using the saddle stitch, a technique unchanged since the 19th century. The waiting list for a Birkin can exceed six years.",
    country: "FR", heritage: "Founded in Paris, 1837",
  },
  {
    slug: "tom-ford", name: "Tom Ford",
    description: "Modern luxury with cinematic flair. sharp, sensual, unapologetic.",
    story: "Tom Ford revitalized Gucci in the 1990s, then built his own house in 2006. His designs appear in James Bond films. The brand's signature: razor-sharp tailoring meeting unabashed glamour.",
    country: "US", heritage: "Launched in New York, 2006",
  },
];

const CATEGORIES = [
  { name: "Men", slug: "men", parentSlug: null },
  { name: "Women", slug: "women", parentSlug: null },
  { name: "Clothing", slug: "men-clothing", parentSlug: "men" },
  { name: "Outerwear", slug: "men-outerwear", parentSlug: "men-clothing" },
  { name: "Tailoring", slug: "men-tailoring", parentSlug: "men-clothing" },
  { name: "Accessories", slug: "men-accessories", parentSlug: "men" },
];

const TAGS = [
  { name: "Cashmere", slug: "cashmere" },
  { name: "Silk", slug: "silk" },
  { name: "Leather", slug: "leather" },
  { name: "Vicuna", slug: "vicuna" },
  { name: "Merino", slug: "merino" },
  { name: "Sustainable", slug: "sustainable" },
  { name: "Handmade", slug: "handmade" },
  { name: "Limited Edition", slug: "limited-edition" },
];

const MATERIALS = [
  { name: "Vicuna Wool", description: "The rarest natural fiber, warmer than cashmere, softer than silk.", origin: "Peru" },
  { name: "Baby Cashmere", description: "Combed from Hircus goat kids under 12 months old.", origin: "Inner Mongolia" },
  { name: "Tuscan Leather", description: "Vegetable-tanned in Santa Croce sull'Arno.", origin: "Italy" },
  { name: "Sea Island Cotton", description: "The longest staple cotton fiber in the world.", origin: "Caribbean" },
  { name: "Zibeline Silk", description: "Heavy textured silk with a subtle sheen.", origin: "Italy" },
];

const PRODUCTS = [
  {
    name: "Vicuna Wool Overcoat", sku: "LVP-OW-001", price: "12500.00",
    description: "Hand-finished overcoat in 100% Vicuna wool. The fiber is harvested once every two years from the wild Vicuna of the Peruvian Andes. Each coat requires 6 full skins and 40 hours of hand-finishing.",
    brandSlug: "loro-piana", categorySlug: "men-outerwear",
    tags: ["Vicuna", "Handmade", "Limited Edition"],
    materials: ["Vicuna Wool"],
    inventory: 5,
    variants: [
      { name: "Charcoal / 48", size: "48", color: "Charcoal", colorHex: "#36454F", inventory: 2 },
      { name: "Navy / 50", size: "50", color: "Navy", colorHex: "#000080", inventory: 3 },
    ],
  },
  {
    name: "Cashmere Crewneck Sweater", sku: "BC-CS-002", price: "1850.00",
    description: "12-gauge cashmere crewneck hand-finished in Solomeo. Each sweater passes through 25 pairs of hands before leaving the atelier.",
    brandSlug: "brunello-cucinelli", categorySlug: "men-clothing",
    tags: ["Cashmere", "Handmade", "Sustainable"],
    materials: ["Baby Cashmere"],
    inventory: 12,
    variants: [
      { name: "Beige / M", size: "M", color: "Beige", colorHex: "#F5F5DC", inventory: 5 },
      { name: "Navy / L", size: "L", color: "Navy", colorHex: "#000080", inventory: 7 },
    ],
  },
  {
    name: "Intrecciato Leather Briefcase", sku: "BV-BF-003", price: "5200.00",
    description: "Hand-woven leather briefcase using Bottega Veneta's signature Intrecciato technique. Each briefcase requires 48 hours of hand-weaving.",
    brandSlug: "bottega-veneta", categorySlug: "men-accessories",
    tags: ["Leather", "Handmade"],
    materials: ["Tuscan Leather"],
    inventory: 8,
    variants: [
      { name: "Espresso", size: "One Size", color: "Espresso", colorHex: "#4A2511", inventory: 8 },
    ],
  },
  {
    name: "Birkin 35 Togo Leather", sku: "HM-BK-004", price: "12500.00",
    description: "The iconic Birkin bag in Togo leather. Hand-stitched using the saddle stitch technique. Includes lock, keys, and dust bag.",
    brandSlug: "hermes", categorySlug: "men-accessories",
    tags: ["Leather", "Handmade", "Limited Edition"],
    materials: ["Tusk", "Tuscan Leather"],  // Tusk is part of materials
    inventory: 3,
    variants: [
      { name: "Gold / 35cm", size: "35cm", color: "Gold", colorHex: "#D4AF37", inventory: 1 },
      { name: "Black / 35cm", size: "35cm", color: "Black", colorHex: "#000000", inventory: 2 },
    ],
  },
  {
    name: "Shelton Sharkskin Suit", sku: "TF-SU-005", price: "6800.00",
    description: "Peak lapel suit in midnight blue sharkskin. The Shelton cut features a dropped shoulder and suppressed waist for a modern silhouette.",
    brandSlug: "tom-ford", categorySlug: "men-tailoring",
    tags: ["Silk", "Handmade"],
    materials: ["Zibeline Silk"],
    inventory: 6,
    variants: [
      { name: "Midnight / 48R", size: "48R", color: "Midnight", colorHex: "#191970", inventory: 3 },
      { name: "Charcoal / 50R", size: "50R", color: "Charcoal", colorHex: "#36454F", inventory: 3 },
    ],
  },
];

const USERS = [
  {
    email: "admin@luxeverse.com", name: "Admin User",
    firstName: "Admin", lastName: "User",
    role: "ADMIN", status: "ACTIVE",
    locale: "en", timezone: "UTC",
  },
  {
    email: "customer1@luxeverse.com", name: "James Sterling",
    firstName: "James", lastName: "Sterling",
    role: "CUSTOMER", status: "ACTIVE",
    locale: "en", timezone: "America/New_York",
  },
  {
    email: "customer2@luxeverse.com", name: "Sophia Laurent",
    firstName: "Sophia", lastName: "Laurent",
    role: "CUSTOMER", status: "ACTIVE",
    locale: "fr", timezone: "Europe/Paris",
  },
];

// ---------------------------------------------------------------------------
// SEED EXECUTION
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Starting luxury seed...");

  // Seed Brands
  console.log("📦 Seeding brands...");
  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }
  console.log("✅ Brands seeded");

  // Seed Categories (with parent relations)
  console.log("📦 Seeding categories...");
  const categoryMap = new Map<string, string>(); // slug -> id
  for (const cat of CATEGORIES) {
    const parentId = cat.parentSlug ? categoryMap.get(cat.parentSlug) : null;
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, parentId },
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log("✅ Categories seeded");

  // Seed Tags
  console.log("📦 Seeding tags...");
  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log("✅ Tags seeded");

  // Seed Materials
  console.log("📦 Seeding materials...");
  for (const material of MATERIALS) {
    await prisma.material.upsert({
      where: { name: material.name },
      update: {},
      create: material,
    });
  }
  console.log("✅ Materials seeded");

  // Seed Products
  console.log("📦 Seeding products...");
  for (const product of PRODUCTS) {
    const brand = await prisma.brand.findUnique({ where: { slug: product.brandSlug } });
    const category = await prisma.category.findUnique({ where: { slug: product.categorySlug } });
    if (!brand || !category) continue;

    // Find tags and materials by name
    const tagRecords = await prisma.tag.findMany({
      where: { name: { in: product.tags } },
    });
    const materialRecords = await prisma.material.findMany({
      where: { name: { in: product.materials } },
    });

    const createdProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        slug: product.sku.toLowerCase().replace(/-/g, ""),
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        brandId: brand.id,
        categoryId: category.id,
        status: "ACTIVE",
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
        materials: { connect: materialRecords.map((m) => ({ id: m.id })) },
      },
    });

    // Seed variants
    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: { sku: `${product.sku}-${variant.name.replace(/[/\s]/g, "-")}` },
        update: {},
        create: {
          productId: createdProduct.id,
          sku: `${product.sku}-${variant.name.replace(/[/\s]/g, "-")}`,
          name: variant.name,
          size: variant.size,
          color: variant.color,
          colorHex: variant.colorHex,
          price: product.price,
          inventory: variant.inventory,
          status: "ACTIVE",
        },
      });
    }
  }
  console.log("✅ Products & variants seeded");

  // Seed Users
  console.log("📦 Seeding users...");
  for (const user of USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        locale: user.locale,
        timezone: user.timezone,
      },
    });
  }
  console.log("✅ Users seeded");

  console.log("\n🎉 Seed complete! Database populated with luxury e-commerce data.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
