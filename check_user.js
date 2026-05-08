const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const email = 'paulguzman@gmail.com'; // O el email que está fallando
    
    // Busca por email exacto o que contenga
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'paulguzman',
          mode: 'insensitive'
        }
      },
      include: {
        accounts: true,
        sessions: true
      }
    });

    console.log("Usuarios encontrados:", JSON.stringify(users, null, 2));

    // Busca cuentas huérfanas o duplicadas
    const accounts = await prisma.account.findMany();
    console.log(`Total accounts en DB: ${accounts.length}`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
