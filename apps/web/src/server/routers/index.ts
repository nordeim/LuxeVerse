import { router } from "../trpc";
import { aiRouter } from "./ai";
import { cartRouter } from "./cart";
import { loyaltyRouter } from "./loyalty";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { reviewRouter } from "./review";
import { savedOutfitRouter } from "./savedOutfit";
import { searchRouter } from "./search";
import { ugcRouter } from "./ugc";
import { userRouter } from "./user";
import { wishlistRouter } from "./wishlist";

import { visualSearchRouter } from "./visualSearch";
import { newsletterRouter } from "./newsletter";

export const appRouter = router({
  ai: aiRouter,
  cart: cartRouter,
  loyalty: loyaltyRouter,
  newsletter: newsletterRouter,
  order: orderRouter,
  product: productRouter,
  review: reviewRouter,
  savedOutfit: savedOutfitRouter,
  search: searchRouter,
  ugc: ugcRouter,
  user: userRouter,
  visualSearch: visualSearchRouter,
  wishlist: wishlistRouter,
});

// Export type for client
export type AppRouter = typeof appRouter;
