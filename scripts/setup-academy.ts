import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const YEAR = 2026;

const GRADES = [
  {
    name: "Jardín",
    code: "JARDIN",
    groups: [1],
  },
  {
    name: "Transición",
    code: "TRANSICION",
    groups: [1, 2],
  },
  {
    name: "1°",
    code: "1",
    groups: [1, 2],
  },
  {
    name: "2°",
    code: "2",
    groups: [1, 2],
  },
  {
    name: "3°",
    code: "3",
    groups: [1, 2],
  },
  {
    name: "4°",
    code: "4",
    groups: [1, 2],
  },
  {
    name: "5°",
    code: "5",
    groups: [1, 2],
  },
  {
    name: "6°",
    code: "6",
    groups: [1, 2],
  },
  {
    name: "7°",
    code: "7",
    groups: [1, 2],
  },
  {
    name: "8°",
    code: "8",
    groups: [1, 2],
  },
  {
    name: "9°",
    code: "9",
    groups: [1, 2],
  },
  {
    name: "10°",
    code: "10",
    groups: [1, 2],
  },
  {
    name: "11°",
    code: "11",
    groups: [1, 2],
  },
];

async function main() {
  console.log(`\nConfigurando estructura académica ${YEAR}...\n`);

  const academicYear = await prisma.academicYear.upsert({
    where: {
      year: YEAR,
    },
    update: {
      active: true,
    },
    create: {
      year: YEAR,
      active: true,
    },
  });

  console.log(`✓ Año académico: ${academicYear.year}`);

  let totalGroups = 0;

  for (const grade of GRADES) {
    const gradeLevel = await prisma.gradeLevel.upsert({
      where: {
        code: grade.code,
      },
      update: {
        name: grade.name,
      },
      create: {
        name: grade.name,
        code: grade.code,
      },
    });

    console.log(`\n✓ Nivel: ${grade.name}`);

    for (const number of grade.groups) {
      let groupName: string;

      if (grade.code === "JARDIN") {
        groupName = "Jardín";
      } else if (grade.code === "TRANSICION") {
        groupName = `Transición ${number}`;
      } else {
        groupName = `${grade.code}-${number}`;
      }

      const group = await prisma.group.upsert({
        where: {
          academicYearId_gradeLevelId_number: {
            academicYearId: academicYear.id,
            gradeLevelId: gradeLevel.id,
            number,
          },
        },
        update: {
          name: groupName,
        },
        create: {
          academicYearId: academicYear.id,
          gradeLevelId: gradeLevel.id,
          number,
          name: groupName,
        },
      });

      console.log(`  ✓ ${group.name}`);

      totalGroups++;
    }
  }

  console.log("\n========================================");
  console.log("ESTRUCTURA ACADÉMICA CREADA");
  console.log("========================================");
  console.log(`Año académico: ${YEAR}`);
  console.log(`Niveles: ${GRADES.length}`);
  console.log(`Grupos: ${totalGroups}`);
  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });