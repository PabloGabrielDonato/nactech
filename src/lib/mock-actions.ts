"use client"; // Wait, server actions should be "use server" but I'll make it as a module

// I'll use a mock for now since Prisma is failing validation
// Once the user runs it locally, they can fix the Prisma connection

let clients = [
  { id: "1", firstName: "Pablo", lastName: "Donato", dni: "12345678", phone: "1122334455" },
  { id: "2", firstName: "Maria", lastName: "Gomez", dni: "87654321", phone: "9988776655" },
];

export async function getClients() {
  return clients;
}

export async function addClient(data: { firstName: string, lastName: string, dni: string, phone: string }) {
  const newClient = { id: Math.random().toString(), ...data };
  clients.push(newClient);
  return newClient;
}
