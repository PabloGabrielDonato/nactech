import { getRepairs, getTransactions, getProducts } from "@/app/actions";
import DashboardClient from "@/components/DashboardClient";

export default async function Home() {
  const repairs = await getRepairs();
  const transactions = await getTransactions();
  const products = await getProducts();

  return (
    <DashboardClient 
      initialRepairs={repairs} 
      initialTransactions={transactions} 
      initialProducts={products} 
    />
  );
}
