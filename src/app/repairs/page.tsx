import { getRepairs, getClients } from "@/app/actions";
import { RepairsClient } from "@/components/RepairsClient";

export default async function RepairsPage() {
  const repairs = await getRepairs();
  const clients = await getClients();

  return <RepairsClient initialRepairs={repairs} initialClients={clients} />;
}
