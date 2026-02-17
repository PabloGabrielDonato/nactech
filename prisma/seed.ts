import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Crear un cliente
  const pablo = await prisma.client.upsert({
    where: { dni: '12345678' },
    update: {},
    create: {
      firstName: 'Pablo',
      lastName: 'Donato',
      dni: '12345678',
      phone: '1122334455',
    },
  })

  // Crear una reparación
  await prisma.repair.create({
    data: {
      clientId: pablo.id,
      deviceModel: 'iPhone 15 Pro',
      problem: 'Cambio de pantalla',
      price: 150000,
      status: 'IN_PROGRESS',
    },
  })

  // Crear unos productos
  await prisma.product.createMany({
    data: [
      { name: 'Funda Silicona', category: 'Fundas', price: 15000, stock: 10 },
      { name: 'Cargador 20W', category: 'Cargadores', price: 45000, stock: 5 },
    ],
  })

  console.log('Datos de prueba insertados!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
