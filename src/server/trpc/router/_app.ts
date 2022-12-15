import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { shortLinkRouter } from './short-link';
import { wishRouter } from './Wish/wish';
import { wishListRouter } from './Wish/wishlist';

export const appRouter = router({
	example: exampleRouter,
	shortLink: shortLinkRouter,
	auth: authRouter,
	wish: wishRouter,
	wishList: wishListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
