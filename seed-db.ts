import { drizzle } from "drizzle-orm/mysql2";
import { weapons, ammunition, courses, scheduleRequests } from "./drizzle/schema";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL não configurada");
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log("Conectando ao banco de dados...");
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("Limpando dados existentes...");
    await connection.execute("DELETE FROM schedule_requests");
    await connection.execute("DELETE FROM weapons");
    await connection.execute("DELETE FROM ammunition");
    await connection.execute("DELETE FROM courses");

    console.log("Inserindo armamentos...");
    const weaponsData = [
      {
        name: "Pistola Taurus PT92",
        category: "Pistola",
        caliber: "9mm",
        manufacturer: "Taurus",
        description: "Pistola semiautomática de ação dupla com segurança manual",
        specifications: JSON.stringify({
          capacity: 17,
          weight: "34 oz",
          barrel_length: "4.5 inches",
          material: "Aço carbono"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=Taurus+PT92",
        inStock: 5
      },
      {
        name: "Revólver Taurus 686",
        category: "Revólver",
        caliber: ".357 Magnum",
        manufacturer: "Taurus",
        description: "Revólver de ação dupla com 6 câmaras",
        specifications: JSON.stringify({
          capacity: 6,
          weight: "37 oz",
          barrel_length: "4 inches",
          material: "Aço inoxidável"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=Taurus+686",
        inStock: 3
      },
      {
        name: "Rifle Rossi RS22",
        category: "Rifle",
        caliber: ".22 LR",
        manufacturer: "Rossi",
        description: "Rifle semiautomático compacto ideal para iniciantes",
        specifications: JSON.stringify({
          capacity: 10,
          weight: "4.5 lbs",
          barrel_length: "18 inches",
          material: "Aço e polímero"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=Rossi+RS22",
        inStock: 2
      },
      {
        name: "Espingarda Benelli M2",
        category: "Espingarda",
        caliber: "12 Gauge",
        manufacturer: "Benelli",
        description: "Espingarda semiautomática de inércia para caça e tiro",
        specifications: JSON.stringify({
          capacity: 3,
          weight: "7 lbs",
          barrel_length: "28 inches",
          material: "Aço e madeira"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=Benelli+M2",
        inStock: 1
      }
    ];

    for (const weapon of weaponsData) {
      await db.insert(weapons).values(weapon);
    }
    console.log("✓ Armamentos inseridos");

    console.log("Inserindo munições...");
    const ammunitionData = [
      {
        name: "Munição 9mm Parabellum",
        caliber: "9mm",
        manufacturer: "CBC",
        description: "Munição de qualidade para treino e competição",
        specifications: JSON.stringify({
          type: "Full Metal Jacket",
          weight: "8g",
          velocity: "350 m/s"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=9mm+CBC",
        unitsPerBox: 50,
        inStock: 500
      },
      {
        name: "Munição .357 Magnum",
        caliber: ".357 Magnum",
        manufacturer: "Remington",
        description: "Munição de potência para revólveres",
        specifications: JSON.stringify({
          type: "Jacketed Soft Point",
          weight: "158g",
          velocity: "1450 m/s"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=357+Magnum",
        unitsPerBox: 50,
        inStock: 200
      },
      {
        name: "Munição .22 LR",
        caliber: ".22 LR",
        manufacturer: "Eley",
        description: "Munição de precisão para tiro esportivo",
        specifications: JSON.stringify({
          type: "Lead Round Nose",
          weight: "2.6g",
          velocity: "330 m/s"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=22+LR",
        unitsPerBox: 50,
        inStock: 1000
      },
      {
        name: "Munição 12 Gauge",
        caliber: "12 Gauge",
        manufacturer: "Federal",
        description: "Munição para espingarda com chumbo",
        specifications: JSON.stringify({
          type: "Lead Shot",
          weight: "28g",
          velocity: "400 m/s"
        }),
        imageUrl: "https://via.placeholder.com/300x200?text=12+Gauge",
        unitsPerBox: 25,
        inStock: 300
      }
    ];

    for (const ammo of ammunitionData) {
      await db.insert(ammunition).values(ammo);
    }
    console.log("✓ Munições inseridas");

    console.log("Inserindo cursos...");
    const coursesData = [
      {
        name: "Curso de Tiro Iniciante",
        description: "Curso básico para pessoas que nunca tiveram experiência com armas de fogo. Aborda segurança, postura, mira e disparo.",
        duration: 4,
        prerequisites: "Maioridade e documento de identidade",
        instructor: "Carlos Silva",
        maxParticipants: 6,
        imageUrl: "https://via.placeholder.com/300x200?text=Curso+Iniciante"
      },
      {
        name: "Curso de Tiro Intermediário",
        description: "Aperfeiçoamento das técnicas básicas com foco em velocidade, precisão e diferentes posições de tiro.",
        duration: 6,
        prerequisites: "Ter completado o curso iniciante",
        instructor: "Ana Costa",
        maxParticipants: 8,
        imageUrl: "https://via.placeholder.com/300x200?text=Curso+Intermediário"
      },
      {
        name: "Curso de Tiro Avançado",
        description: "Treinamento avançado para competição com técnicas de tiro tático e controle de recoil.",
        duration: 8,
        prerequisites: "Ter completado o curso intermediário",
        instructor: "Roberto Ferreira",
        maxParticipants: 4,
        imageUrl: "https://via.placeholder.com/300x200?text=Curso+Avançado"
      },
      {
        name: "Curso de Segurança e Manutenção",
        description: "Aprendizado sobre segurança no manuseio, armazenamento seguro e manutenção básica de armas.",
        duration: 3,
        prerequisites: "Nenhum",
        instructor: "Marcos Oliveira",
        maxParticipants: 10,
        imageUrl: "https://via.placeholder.com/300x200?text=Segurança"
      },
      {
        name: "Curso de Tiro Esportivo",
        description: "Preparação para competições oficiais de tiro esportivo com regulamentações e técnicas específicas.",
        duration: 10,
        prerequisites: "Ter completado o curso intermediário",
        instructor: "Patricia Lima",
        maxParticipants: 5,
        imageUrl: "https://via.placeholder.com/300x200?text=Tiro+Esportivo"
      }
    ];

    for (const course of coursesData) {
      await db.insert(courses).values(course);
    }
    console.log("✓ Cursos inseridos");

    console.log("Inserindo agendamentos de exemplo...");
    const today = new Date();
    const exampleSchedules = [
      {
        fullName: "João Silva",
        email: "joao@example.com",
        phone: "(11) 98765-4321",
        documentType: "CAC" as const,
        documentNumber: "123456-AB",
        requestedDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        requestedTime: "14:00",
        numberOfPeople: 2,
        experience: "beginner" as const,
        observations: "Primeiro agendamento",
        status: "completed" as const
      },
      {
        fullName: "Maria Santos",
        email: "maria@example.com",
        phone: "(11) 99876-5432",
        documentType: "RG" as const,
        documentNumber: "1234567",
        requestedDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        requestedTime: "10:00",
        numberOfPeople: 1,
        experience: "intermediate" as const,
        observations: "Treino regular",
        status: "completed" as const
      },
      {
        fullName: "Pedro Costa",
        email: "pedro@example.com",
        phone: "(11) 97654-3210",
        documentType: "CAC" as const,
        documentNumber: "654321-XY",
        requestedDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        requestedTime: "16:00",
        numberOfPeople: 3,
        experience: "advanced" as const,
        observations: "Competição preparatória",
        status: "completed" as const
      },
      {
        fullName: "Ana Oliveira",
        email: "ana@example.com",
        phone: "(11) 96543-2109",
        documentType: "RG" as const,
        documentNumber: "7654321",
        requestedDate: today,
        requestedTime: "09:00",
        numberOfPeople: 1,
        experience: "beginner" as const,
        observations: "Primeira vez",
        status: "approved" as const
      }
    ];

    for (const schedule of exampleSchedules) {
      await db.insert(scheduleRequests).values(schedule);
    }
    console.log("✓ Agendamentos de exemplo inseridos");

    console.log("\n✅ Banco de dados populado com sucesso!");
    await connection.end();
  } catch (error) {
    console.error("Erro ao popular banco de dados:", error);
    process.exit(1);
  }
}

seedDatabase();
