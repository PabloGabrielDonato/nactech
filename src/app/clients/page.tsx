import { getClients } from "@/app/actions";
import { ClientsClient } from "@/components/ClientsClient";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsClient initialClients={clients} />;
}
