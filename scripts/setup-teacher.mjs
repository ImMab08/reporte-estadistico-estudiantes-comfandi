import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| EDUMETRICKS
| CARGA DE PROFESORES ACTIVOS
|--------------------------------------------------------------------------
|
| Fuente:
| LISTADO PROFESORES ACTIVOS YUMBO SEPTIEMBRE 18 2026
|
| Total esperado: 41 profesores
|
| IMPORTANTE:
| - No se utilizan las contraseñas antiguas de users.json.
| - No se agregan Brenda ni Luis Alejandro.
| - No se inventan correos que no hayan sido confirmados.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| 1. PROFESORES ACTIVOS
|--------------------------------------------------------------------------
*/

const TEACHERS = [
  {
    code: "60133",
    fullName: "VANESSA GARCIA",
    email: "vanessagarcia@comfandi.edu.co",
  },

  {
    code: "60154",
    fullName: "LEISLY NICOLH MEJIA BOLAÑOS",
    email: "leislimejia@comfandi.edu.co",
  },

  {
    code: "60198",
    fullName: "ZANDRA MILENA RODRIGUEZ OREJUELA",
    email: null,
  },

  {
    code: "60208",
    fullName: "PATRICIA CAICEDO SEPULVEDA",
    email: "patriciacaicedo@comfandi.edu.co",
  },

  {
    code: "60220",
    fullName: "MARITZA MUÑOZ OSPINA",
    email: "maritzamunoz@comfandi.edu.co",
  },

  {
    code: "60223",
    fullName: "CATALINA QUIJANO GAVIRIA",
    email: null,
  },

  {
    code: "60234",
    fullName: "GERALDIN LOPEZ OSPINA",
    email: "geraldinelopez@comfandi.edu.co",
  },

  {
    code: "60237",
    fullName: "LEONEL ANDRÉS AMARILES RIVERA",
    email: "leonelamariles@comfandi.edu.co",
  },

  {
    code: "60265",
    fullName: "JENNY SALAS QUINTERO",
    email: "jennysalas@comfandi.edu.co",
  },

  {
    code: "60279",
    fullName: "OSCAR GOMEZ PEÑA",
    email: "oscargomez@comfandi.edu.co",
  },

  {
    code: "60292",
    fullName: "DIANA PAOLA CARABALI AGRON",
    email: "dianacarabali@comfandi.edu.co",
  },

  {
    code: "60349",
    fullName: "VIVIANA VANESSA PALOMINO ZULUAGA",
    email: "vivianapalomino@comfandi.edu.co",
  },

  {
    code: "60366",
    fullName: "YULIETH VIVIANA PULGARIN",
    email: "yuliethpulgarin@comfandi.edu.co",
  },

  {
    code: "60398",
    fullName: "YOSELIN CLAVIJO VANEGAS",
    email: "yoselinclavijo@comfandi.edu.co",
  },

  {
    code: "60418",
    fullName: "ALEJANDRA MENDEZ CANO",
    email: "alejandramendez@comfandi.edu.co",
  },

  {
    code: "60426",
    fullName: "EDIHT LORENA BURBANO BENAVIDES",
    email: "lorenaburbano@comfandi.edu.co",
  },

  {
    code: "60475",
    fullName: "ANA MARIA ADARME MONCAYO",
    email: "anamariaadarme@comfandi.edu.co",
  },

  {
    code: "60482",
    fullName: "BRANDON DAVID MUÑOZ CORREA",
    email: "brandonmunoz@comfandi.edu.co",
  },

  {
    code: "60696",
    fullName: "NATALIA FREYRE CORTAZAR",
    email: "nataliafreyre@comfandi.edu.co",
  },

  {
    code: "59983",
    fullName: "FABER DE JESUS TENORIO ALVAREZ",
    email: "fabertenorio@comfandi.edu.co",
  },

  {
    code: "60019",
    fullName: "ANGELA MARIA AGUDELO SCHONHOBEL",
    email: null,
  },

  {
    code: "60024",
    fullName: "JOHNY JULIAN OSPINA MONTAÑO",
    email: "johnyospina@comfandi.edu.co",
  },

  {
    code: "60028",
    fullName: "GUSTAVO ADOLFO MONTAÑA IBARRA",
    email: "gustavomontana@comfandi.edu.co",
  },

  {
    code: "60104",
    fullName: "CHRISTIAN DAVID GAON URRUTIA",
    email: "cristiangaon@comfandi.edu.co",
  },

  {
    code: "60529",
    fullName: "SANDRA PATRICIA RAMIREZ PAZ",
    email: "sandraramirez@comfandi.edu.co",
  },

  {
    code: "60569",
    fullName: "JUAN CAMILO NARVAEZ TULANDE",
    email: "juancamilonarvaez@comfandi.edu.co",
  },

  {
    code: "60576",
    fullName: "JESUS HERNAN ANGULO RODRIGUEZ",
    email: "jesusangulo@comfandi.edu.co",
  },

  {
    code: "60639",
    fullName: "JOSE ALDEMAR OROZCO RODRIGUEZ",
    email: "josealdemarorozco@comfandi.edu.co",
  },

  {
    code: "60657",
    fullName: "ALEXANDER CORTES ORTIZ",
    email: "alexandracortes@comfandi.edu.co",
  },

  {
    code: "60143",
    fullName: "EUBEIMAR HERNANDO SAMBONI PINZON",
    email: "hernandosamboni@comfandi.edu.co",
  },

  {
    code: "60365",
    fullName: "SOFIA VARGAS",
    email: "sofiavargas@comfandi.edu.co",
  },

  {
    code: "60432",
    fullName: "CARLOS HERNAN MENDEZ SANCHEZ",
    email: "carlosmendez@comfandi.edu.co",
  },

  {
    code: "60444",
    fullName: "ANTONY ALFONSO REYES CAÑAS",
    email: "antonyreyes@comfandi.edu.co",
  },

  {
    code: "59996",
    fullName: "YULI ANDREA FIGUEROA OMEZ",
    email: "yulifigueroa@comfandi.edu.co",
  },

  {
    code: "60457",
    fullName: "FRANKY HELY VARGAS LOPEZ",
    email: "frankyvargas@comfandi.edu.co",
  },

  {
    code: "60394",
    fullName: "KORAYN ANDREA ZAPATA DIAZGRANADOS",
    email: "koraynzapata@comfandi.edu.co",
  },

  {
    code: "60400",
    fullName: "CAROLINA ORTIZ MONTENEGRO",
    email: "carolinaortiz@comfandi.edu.co",
  },

  {
    code: "60239",
    fullName: "JOAN SEBASTIAN ROJAS BEJARANO",
    email: "joanrojas@comfandi.edu.co",
  },

  {
    code: "60294",
    fullName: "JUAN DAVID CELIS RUIZ",
    email: "juandavidcelisruiz@comfandi.edu.co",
  },

  {
    code: "60397",
    fullName: "DAHIAN LIBHET ORTIZ LUGO",
    email: "dahianlibhetortiz@comfandi.edu.co",
  },

  {
    code: "60060",
    fullName: "VALERY MARCELA DE JESUS NAVARRO",
    email: "valerydejesus@comfandi.edu.co",
  },
];


/*
|--------------------------------------------------------------------------
| 2. ASIGNACIONES DE DIRECTORES Y FACILITADORES
|--------------------------------------------------------------------------
|
| El grado y el grupo están separados.
|
| Ejemplo:
|
| grade: "1"
| group: "1"
|
| Se puede mostrar posteriormente como:
|
| 1-1
|
|--------------------------------------------------------------------------
*/

const GROUP_ASSIGNMENTS = [
  {
    grade: "JARDIN",
    group: "1",
    director: "ANGELA MARIA AGUDELO SCHONHOBEL",
    facilitators: [],
  },

  {
    grade: "TRANSICION",
    group: "1",
    director: "CATALINA QUIJANO GAVIRIA",
    facilitators: [],
  },

  {
    grade: "TRANSICION",
    group: "2",
    director: "ZANDRA MILENA RODRIGUEZ OREJUELA",
    facilitators: [],
  },

  {
    grade: "1",
    group: "1",
    director: "NATALIA FREYRE CORTAZAR",
    facilitators: [],
  },

  {
    grade: "1",
    group: "2",
    director: "MARITZA MUÑOZ OSPINA",
    facilitators: [],
  },

  {
    grade: "2",
    group: "1",
    director: "VANESSA GARCIA",
    facilitators: [],
  },

  {
    grade: "2",
    group: "2",
    director: "LEONEL ANDRÉS AMARILES RIVERA",
    facilitators: [],
  },

  {
    grade: "3",
    group: "1",
    director: "YULIETH VIVIANA PULGARIN",
    facilitators: [],
  },

  {
    grade: "3",
    group: "2",
    director: "SANDRA PATRICIA RAMIREZ PAZ",
    facilitators: [],
  },

  {
    grade: "4",
    group: "1",
    director: "OSCAR GOMEZ PEÑA",
    facilitators: [],
  },

  {
    grade: "4",
    group: "2",
    director: "ANTONY ALFONSO REYES CAÑAS",
    facilitators: [],
  },

  {
    grade: "5",
    group: "1",
    director: "KORAYN ANDREA ZAPATA DIAZGRANADOS",
    facilitators: [],
  },

  {
    grade: "5",
    group: "2",
    director: "JOHNY JULIAN OSPINA MONTAÑO",
    facilitators: [],
  },

  {
    grade: "6",
    group: "1",
    director: "JESUS HERNAN ANGULO RODRIGUEZ",
    facilitators: [
      "YOSELIN CLAVIJO VANEGAS",
    ],
  },

  {
    grade: "6",
    group: "2",
    director: "ANA MARIA ADARME MONCAYO",
    facilitators: [
      "CAROLINA ORTIZ MONTENEGRO",
    ],
  },

  {
    grade: "7",
    group: "1",
    director: "LEISLY NICOLH MEJIA BOLAÑOS",
    facilitators: [
      "VIVIANA VANESSA PALOMINO ZULUAGA",
    ],
  },

  {
    grade: "7",
    group: "2",
    director: null,
    facilitators: [
      "VALERY MARCELA DE JESUS NAVARRO",
    ],
  },

  {
    grade: "8",
    group: "1",
    director: "DAHIAN LIBHET ORTIZ LUGO",
    facilitators: [
      "ALEXANDER CORTES ORTIZ",
    ],
  },

  {
    grade: "8",
    group: "2",
    director: "CARLOS HERNAN MENDEZ SANCHEZ",
    facilitators: [],
  },

  {
    grade: "9",
    group: "1",
    director: "JENNY SALAS QUINTERO",
    facilitators: [
      "JOSE ALDEMAR OROZCO RODRIGUEZ",
    ],
  },

  {
    grade: "9",
    group: "2",
    director: "DIANA PAOLA CARABALI AGRON",
    facilitators: [
      "SOFIA VARGAS",
    ],
  },

  {
    grade: "10",
    group: "1",
    director: "GUSTAVO ADOLFO MONTAÑA IBARRA",
    facilitators: [
      "EUBEIMAR HERNANDO SAMBONI PINZON",
    ],
  },

  {
    grade: "10",
    group: "2",
    director: "JUAN DAVID CELIS RUIZ",
    facilitators: [
      "JOAN SEBASTIAN ROJAS BEJARANO",
    ],
  },

  {
    grade: "11",
    group: "1",
    director: "ALEJANDRA MENDEZ CANO",
    facilitators: [
      "FRANKY HELY VARGAS LOPEZ",
    ],
  },

  {
    grade: "11",
    group: "2",
    director: "EDIHT LORENA BURBANO BENAVIDES",
    facilitators: [
      "GERALDIN LOPEZ OSPINA",
    ],
  },
];


/*
|--------------------------------------------------------------------------
| 3. UTILIDADES
|--------------------------------------------------------------------------
*/

function generateTemporaryPassword() {
  return crypto.randomBytes(9).toString("base64url");
}


function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const derivedKey = crypto.scryptSync(
    password,
    salt,
    64
  );

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}


function normalizeName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}


/*
|--------------------------------------------------------------------------
| 4. PROCESO PRINCIPAL
|--------------------------------------------------------------------------
*/

async function main() {
  console.log("");
  console.log("==============================================");
  console.log(" EDUMETRICKS");
  console.log(" CARGA DE PROFESORES ACTIVOS");
  console.log("==============================================");
  console.log("");

  console.log(
    `Profesores recibidos en el listado: ${TEACHERS.length}`
  );

  /*
  |--------------------------------------------------------------------------
  | Validación
  |--------------------------------------------------------------------------
  */

  if (TEACHERS.length !== 41) {
    throw new Error(
      `Se esperaban 41 profesores, pero hay ${TEACHERS.length}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Mapa de profesores
  |--------------------------------------------------------------------------
  */

  const teacherMap = new Map();

  /*
  |--------------------------------------------------------------------------
  | Credenciales nuevas
  |--------------------------------------------------------------------------
  */

  const generatedCredentials = [];

  /*
  |--------------------------------------------------------------------------
  | Profesores sin correo
  |--------------------------------------------------------------------------
  */

  const pendingEmails = [];

  /*
  |--------------------------------------------------------------------------
  | 5. CREAR USUARIOS Y PROFESORES
  |--------------------------------------------------------------------------
  */

  for (const teacher of TEACHERS) {
    console.log("");
    console.log("----------------------------------------------");
    console.log(`${teacher.code} - ${teacher.fullName}`);

    /*
    |--------------------------------------------------------------------------
    | Si no tenemos correo confirmado
    |--------------------------------------------------------------------------
    */

    if (!teacher.email) {
      console.log("⚠️ Correo pendiente.");

      pendingEmails.push({
        code: teacher.code,
        fullName: teacher.fullName,
      });

      continue;
    }

    const email = teacher.email
      .trim()
      .toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Buscar usuario existente
    |--------------------------------------------------------------------------
    */

    let user = await prisma.user.findUnique({
      where: {
        username: email,
      },
    });

    let temporaryPassword = null;

    /*
    |--------------------------------------------------------------------------
    | Crear usuario
    |--------------------------------------------------------------------------
    */

    if (!user) {
      temporaryPassword =
        generateTemporaryPassword();

      user = await prisma.user.create({
        data: {
          username: email,
          fullName: teacher.fullName,
          passwordHash:
            hashPassword(temporaryPassword),
          active: true,
        },
      });

      console.log("✅ Usuario creado.");

      generatedCredentials.push({
        code: teacher.code,
        fullName: teacher.fullName,
        email,
        temporaryPassword,
      });
    } else {
      console.log("↻ Usuario ya existente.");
    }

    /*
    |--------------------------------------------------------------------------
    | Crear registro Teacher
    |--------------------------------------------------------------------------
    */

    let teacherRecord =
      await prisma.teacher.findUnique({
        where: {
          userId: user.id,
        },
      });

    if (!teacherRecord) {
      teacherRecord =
        await prisma.teacher.create({
          data: {
            userId: user.id,
            active: true,
          },
        });

      console.log("✅ Registro de profesor creado.");
    } else {
      console.log("↻ Registro de profesor ya existente.");
    }

    /*
    |--------------------------------------------------------------------------
    | Guardar en mapa
    |--------------------------------------------------------------------------
    */

    teacherMap.set(
      normalizeName(teacher.fullName),
      teacherRecord
    );
  }


  /*
  |--------------------------------------------------------------------------
  | 6. MOSTRAR ASIGNACIONES
  |--------------------------------------------------------------------------
  |
  | En este punto solamente validamos que las personas existan.
  |
  | La relación definitiva con GroupStaffAssignment se realizará cuando
  | terminemos de ajustar Group para utilizar:
  |
  | GradeLevel + Group
  |
  |--------------------------------------------------------------------------
  */

  console.log("");
  console.log("==============================================");
  console.log(" ASIGNACIONES");
  console.log("==============================================");

  for (const assignment of GROUP_ASSIGNMENTS) {
    const groupName =
      `${assignment.grade}-${assignment.group}`;

    console.log("");
    console.log(`📚 ${groupName}`);

    /*
    |--------------------------------------------------------------------------
    | Director
    |--------------------------------------------------------------------------
    */

    if (assignment.director) {
      const teacher =
        teacherMap.get(
          normalizeName(
            assignment.director
          )
        );

      if (!teacher) {
        console.log(
          `   ⚠️ Director pendiente: ${assignment.director}`
        );
      } else {
        console.log(
          `   👤 Director: ${assignment.director}`
        );
      }
    } else {
      console.log(
        "   👤 Director: VACANTE"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Facilitadores
    |--------------------------------------------------------------------------
    */

    if (
      assignment.facilitators.length === 0
    ) {
      console.log(
        "   👥 Facilitadores: ninguno"
      );
    } else {
      for (
        const facilitator
        of assignment.facilitators
      ) {
        const teacher =
          teacherMap.get(
            normalizeName(
              facilitator
            )
          );

        if (!teacher) {
          console.log(
            `   ⚠️ Facilitador pendiente: ${facilitator}`
          );
        } else {
          console.log(
            `   👥 Facilitador: ${facilitator}`
          );
        }
      }
    }
  }


  /*
  |--------------------------------------------------------------------------
  | 7. GUARDAR CREDENCIALES EN ARCHIVO
  |--------------------------------------------------------------------------
  |
  | Esto permite que no tengamos que copiar las contraseñas desde
  | la terminal.
  |
  | IMPORTANTE:
  | Este archivo contiene contraseñas temporales.
  | No debe subirse a GitHub.
  |
  |--------------------------------------------------------------------------
  */

  const credentialsPath =
    path.resolve(
      "generated-teacher-credentials.json"
    );

  fs.writeFileSync(
    credentialsPath,
    JSON.stringify(
      generatedCredentials,
      null,
      2
    ),
    "utf8"
  );


  /*
  |--------------------------------------------------------------------------
  | 8. RESUMEN
  |--------------------------------------------------------------------------
  */

  console.log("");
  console.log("==============================================");
  console.log(" RESUMEN");
  console.log("==============================================");
  console.log("");

  console.log(
    `👨‍🏫 Profesores en listado: ${TEACHERS.length}`
  );

  console.log(
    `👤 Usuarios nuevos creados: ${generatedCredentials.length}`
  );

  console.log(
    `⚠️ Profesores sin correo: ${pendingEmails.length}`
  );

  console.log(
    `📚 Asignaciones de grupos: ${GROUP_ASSIGNMENTS.length}`
  );


  /*
  |--------------------------------------------------------------------------
  | 9. PROFESORES SIN CORREO
  |--------------------------------------------------------------------------
  */

  if (pendingEmails.length > 0) {
    console.log("");
    console.log(
      "=============================================="
    );
    console.log(
      " PROFESORES PENDIENTES DE CORREO"
    );
    console.log(
      "=============================================="
    );

    for (
      const teacher
      of pendingEmails
    ) {
      console.log(
        `⚠️ ${teacher.code} - ${teacher.fullName}`
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | 10. ARCHIVO DE CREDENCIALES
  |--------------------------------------------------------------------------
  */

  console.log("");
  console.log(
    `🔐 Credenciales guardadas en:`
  );

  console.log(
    credentialsPath
  );

  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    " PROCESO TERMINADO"
  );
  console.log(
    "=============================================="
  );
  console.log("");
}


/*
|--------------------------------------------------------------------------
| EJECUCIÓN
|--------------------------------------------------------------------------
*/

main()
  .catch((error) => {
    console.error("");
    console.error("❌ ERROR:");
    console.error(error);
    console.error("");

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
