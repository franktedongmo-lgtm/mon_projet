const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ARoyal2024!", 10);
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "franktedongmo@gmail.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "franktedongmo@gmail.com",
      password: hashed,
      name: process.env.ADMIN_NAME || "Frank Tedongmo",
    },
  });

  await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  const products = [
    {
      name: "Royal Chocolat",
      description: "Gâteau au chocolat noir, ganache onctueuse et éclats de noisettes.",
      price: 15000,
      promoPrice: 12500,
      category: "GATEAUX",
      stock: 10,
      isTopSale: true,
      prepMinutes: 30,
    },
    {
      name: "Fraise Délice",
      description: "Génoise légère, crème pâtissière et fraises fraîches.",
      price: 13000,
      category: "GATEAUX",
      stock: 8,
      isNew: true,
      prepMinutes: 30,
    },
    {
      name: "Croissant Beurre",
      description: "Croissant pur beurre, croustillant et feuilleté.",
      price: 1000,
      category: "VIENNOISERIES",
      stock: 40,
      isTopSale: true,
      prepMinutes: 10,
    },
    {
      name: "Pain au Chocolat",
      description: "Viennoiserie feuilletée fourrée de deux barres de chocolat.",
      price: 1200,
      category: "VIENNOISERIES",
      stock: 30,
      prepMinutes: 10,
    },
    {
      name: "Jus de Bissap",
      description: "Boisson rafraîchissante à base de fleurs d'hibiscus.",
      price: 1500,
      category: "BOISSONS",
      stock: 25,
      isNew: true,
      prepMinutes: 5,
    },
    {
      name: "Jus de Gingembre",
      description: "Jus naturel de gingembre frais, légèrement sucré.",
      price: 1500,
      category: "BOISSONS",
      stock: 25,
      prepMinutes: 5,
    },
    {
      name: "Poulet DG",
      description: "Plat camerounais signature : poulet sauté aux légumes et plantain.",
      price: 4500,
      category: "PLATS",
      stock: 15,
      isTopSale: true,
      prepMinutes: 35,
    },
    {
      name: "Riz Sauté aux Légumes",
      description: "Riz sauté accompagné de légumes frais et épices maison.",
      price: 3000,
      category: "PLATS",
      stock: 20,
      prepMinutes: 25,
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) await prisma.product.create({ data: p });
  }

  await prisma.promoCode.upsert({
    where: { code: "BIENVENUE10" },
    update: {},
    create: { code: "BIENVENUE10", percentOff: 10 },
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
