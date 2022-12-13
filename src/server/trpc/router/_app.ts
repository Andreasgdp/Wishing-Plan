import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { shortLinkRouter } from './short-link';

export const appRouter = router({
	example: exampleRouter,
	shortLink: shortLinkRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
