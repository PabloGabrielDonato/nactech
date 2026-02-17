"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Clientes
export async function getClients() {
  return await prisma.client.findMany({
    include: { repairs: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function sellProductAction(data: { productId: string; quantity: number; clientId: string }) {
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product || product.stock < data.quantity) throw new Error("Stock insuficiente");

  const client = await prisma.client.findUnique({ where: { id: data.clientId } });
  
  // 1. Reducir Stock
  await prisma.product.update({
    where: { id: data.productId },
    data: { stock: { decrement: data.quantity } }
  });

  // 2. Crear Transacción
  await prisma.transaction.create({
    data: {
      type: "INCOME",
      category: "SALE",
      amount: product.price * data.quantity,
      description: `Venta: ${data.quantity}x ${product.name} - ${client ? `${client.firstName} ${client.lastName}` : 'Mostrador'}`,
      date: new Date(),
    }
  });

  revalidatePath("/stock");
  revalidatePath("/finance");
  revalidatePath("/");
}

export async function updateClient(id: string, data: any) {
  const client = await prisma.client.update({
    where: { id },
    data
  });
  revalidatePath("/clients");
  return client;
}

export async function createClient(data: { firstName: string; lastName: string; dni: string; phone: string }) {
  const client = await prisma.client.create({ data });
  revalidatePath("/clients");
  return client;
}

// Reparaciones
export async function getRepairs() {
  return await prisma.repair.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createRepair(data: any) {
  const repair = await prisma.repair.create({ data });
  revalidatePath("/repairs");
  revalidatePath("/");
  return repair;
}

export async function updateRepairAction(id: string, data: any) {
  const repair = await prisma.repair.update({
    where: { id },
    data,
    include: { client: true }
  });

  // Buscamos si ya existe una transacción vinculada a esta reparación
  const existingTx = await prisma.transaction.findFirst({
    where: { relatedId: id }
  });

  if (data.status === "DELIVERED") {
    // Solo creamos la transacción si no existe ya una
    if (!existingTx) {
      await prisma.transaction.create({
        data: {
          type: "INCOME",
          category: "REPAIR",
          amount: repair.price,
          description: `Reparación: ${repair.deviceModel} - ${repair.client.firstName} ${repair.client.lastName}`,
          date: new Date(),
          relatedId: repair.id
        }
      });
    }
  } else {
    // Si cambiamos el estado a cualquier cosa que NO sea DELIVERED, 
    // y existía una transacción, la borramos para "limpiar" finanzas
    if (existingTx) {
      await prisma.transaction.delete({
        where: { id: existingTx.id }
      });
    }
  }

  revalidatePath("/repairs");
  revalidatePath("/finance");
  revalidatePath("/");
  return repair;
}

// Stock
export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createProduct(data: any) {
  const product = await prisma.product.create({ data });
  revalidatePath("/stock");
  revalidatePath("/");
  return product;
}

export async function updateProductStock(id: string, delta: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (product) {
    await prisma.product.update({
      where: { id },
      data: { stock: Math.max(0, product.stock + delta) }
    });
  }
  revalidatePath("/stock");
}

// Finanzas
export async function getTransactions() {
  return await prisma.transaction.findMany({
    orderBy: { date: 'desc' }
  });
}

export async function createTransaction(data: any) {
  const tx = await prisma.transaction.create({
    data: {
      ...data,
      date: new Date(data.date)
    }
  });
  revalidatePath("/finance");
  revalidatePath("/");
  return tx;
}

// Sistema
export async function exportDatabaseAction() {
  const clients = await prisma.client.findMany({ include: { repairs: true } });
  const products = await prisma.product.findMany();
  const transactions = await prisma.transaction.findMany();
  
  return { clients, products, transactions };
}

export async function resetDatabaseAction() {
  await prisma.transaction.deleteMany();
  await prisma.repair.deleteMany();
  await prisma.client.deleteMany();
  await prisma.product.deleteMany();
  revalidatePath("/");
}

export async function importDatabaseAction(data: { 
  clients: any[], 
  products: any[], 
  transactions: any[] 
}) {
  // Reset previo para asegurar integridad si se desea un "restablecimiento" vía import
  await prisma.transaction.deleteMany();
  await prisma.repair.deleteMany();
  await prisma.client.deleteMany();
  await prisma.product.deleteMany();

  for (const p of data.products) {
    const { id, ...rest } = p;
    await prisma.product.create({ data: rest });
  }
  
  for (const c of data.clients) {
    const { id, repairs, ...rest } = c;
    const createdClient = await prisma.client.create({ data: rest });
    if (repairs) {
      for (const r of repairs) {
        const { id: rid, clientId, createdAt, updatedAt, ...rRest } = r;
        await prisma.repair.create({ 
          data: { 
            ...rRest, 
            clientId: createdClient.id 
          } 
        });
      }
    }
  }

  for (const t of data.transactions) {
    const { id, ...rest } = t;
    await prisma.transaction.create({ data: { ...rest, date: new Date(t.date) } });
  }

  revalidatePath("/");
}
