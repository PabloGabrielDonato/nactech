import { getProducts, getClients } from "@/app/actions";
import { StockClient } from "@/components/StockClient";

export default async function StockPage() {
  const products = await getProducts();
  const clients = await getClients();

  return (
    <div className="p-6">
      <StockClient initialProducts={products} initialClients={clients} />
    </div>
  );
}
