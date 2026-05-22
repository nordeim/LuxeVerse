import { router } from "../trpc";
import { aiRouter } from "./ai";
import { cartRouter } from "./cart";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { reviewRouter } from "./review";
import { savedOutfitRouter } from "./savedOutfit";
import { searchRouter } from "./search";

export const appRouter = router({
  ai: aiRouter,
  cart: cartRouter,
  order: orderRouter,
  product: productRouter,
  review: reviewRouter,
  savedOutfit: savedOutfitRouter,
  search: searchRouter,
});

// Export type for client
export type AppRouter = typeof appRouter;
