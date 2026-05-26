import { createNewArrivalsService } from "@/server/services/newArrivals.service";
import { NewArrivalsClient } from "./NewArrivalsClient";

export async function NewArrivals() {
  const service = createNewArrivalsService();
  const products = await service.list();

  return <NewArrivalsClient products={products} />;
}
