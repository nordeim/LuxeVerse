import { router } from "../trpc";
import { productRouter } from "./product";
import { cartRouter } from "./cart";
import { orderRouter } from "./order";

export const appRouter = router({
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
});

// Export type for client
export type AppRouter = typeof appRouter;
