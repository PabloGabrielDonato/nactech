import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data-db.json');

const INITIAL_DATA = {
  clients: [
    { id: "1", firstName: "Pablo", lastName: "Donato", dni: "12345678", phone: "1122334455" },
    { id: "2", firstName: "Maria", lastName: "Gomez", dni: "87654321", phone: "9988776655" },
  ],
  repairs: [
    { id: "REP-001", clientId: "1", clientName: "Pablo Donato", device: "iPhone 15 Pro", status: "IN_PROGRESS", problem: "Cambio de módulo", price: 120000, createdAt: new Date().toISOString() },
  ],
  products: [
    { id: "P-001", name: "Funda Silicona iPhone 15 Pro", category: "Fundas", price: 15000, stock: 12 },
  ],
  transactions: [
    { id: "T-001", type: "INCOME", category: "REPAIR", description: "Reparación iPhone 15 Pro", amount: 120000, date: new Date().toISOString() },
  ]
};

function getDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function saveDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getClients() {
  return getDb().clients;
}

export async function addClient(client: any) {
  const db = getDb();
  const newClient = { ...client, id: Math.random().toString(36).substr(2, 9) };
  db.clients.push(newClient);
  saveDb(db);
  return newClient;
}

export async function getRepairs() {
  return getDb().repairs;
}

// Add more functions as needed...
