import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'nactech-db.json');

const INITIAL_DATA = {
  clients: [
    { id: "1", firstName: "Pablo", lastName: "Donato", dni: "12345678", phone: "1122334455" },
    { id: "2", firstName: "Maria", lastName: "Gomez", dni: "87654321", phone: "9988776655" },
  ],
  repairs: [
    { 
      id: "REP-001", 
      clientId: "1", 
      clientName: "Pablo Donato", 
      device: "iPhone 15 Pro", 
      status: "IN_PROGRESS", 
      problem: "Cambio de módulo", 
      price: 120000, 
      cost: 45000,
      imei: "351234567890123",
      password: "1234",
      createdAt: new Date().toISOString() 
    },
  ],
  products: [
    { id: "P-001", name: "Funda Silicona iPhone 15 Pro", category: "Fundas", price: 15000, stock: 12 },
    { id: "P-002", name: "Cargador 20W Original", category: "Cargadores", price: 45000, stock: 5 },
  ],
  transactions: [
    { id: "T-001", type: "INCOME", category: "REPAIR", description: "Reparación iPhone 15 Pro", amount: 120000, date: new Date().toISOString() },
  ]
};

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Clients
export const getClients = async () => readDb().clients;
export const addClient = async (client: any) => {
  const db = readDb();
  const newClient = { ...client, id: Math.random().toString(36).substr(2, 9) };
  db.clients.push(newClient);
  writeDb(db);
  return newClient;
};

// Repairs
export const getRepairs = async () => readDb().repairs;
export const addRepair = async (repair: any) => {
  const db = readDb();
  const newRepair = { ...repair, id: `REP-${Math.floor(1000 + Math.random() * 9000)}`, createdAt: new Date().toISOString() };
  db.repairs.push(newRepair);
  writeDb(db);
  return newRepair;
};
export const updateRepair = async (id: string, data: any) => {
  const db = readDb();
  const index = db.repairs.findIndex((r: any) => r.id === id);
  if (index !== -1) {
    db.repairs[index] = { ...db.repairs[index], ...data };
    writeDb(db);
    return db.repairs[index];
  }
  return null;
};

// Products
export const getProducts = async () => readDb().products;
export const updateProduct = async (id: string, data: any) => {
  const db = readDb();
  const index = db.products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...data };
    writeDb(db);
    return db.products[index];
  }
  return null;
};

// Transactions
export const getTransactions = async () => readDb().transactions;
export const addTransaction = async (tx: any) => {
  const db = readDb();
  const newTx = { ...tx, id: `T-${Math.floor(1000 + Math.random() * 9000)}`, date: tx.date || new Date().toISOString() };
  db.transactions.push(newTx);
  writeDb(db);
  return newTx;
};
