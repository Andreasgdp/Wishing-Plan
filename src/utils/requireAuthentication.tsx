import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export function requireAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		const { req } = ctx;

		if (req.headers.cookie) {
			try {
				// get current route
				const route = ctx.resolvedUrl;

				const redirectUrl = route === '/' ? '/product' : '/auth/signin';

				// Send a request to the API and verify that the user exists
				// Reject and redirect if the user is undefined or there is no accessToken
				const session = await getSession(ctx);

				if (!session) {
					return {
						redirect: {
							destination: redirectUrl,
							permanent: false,
						},
					};
				}
			} catch (error) {
				// Failure in the query or any error should fallback here
				// this route is possibly forbidden means the cookie is invalid
				// or the cookie is expired
				return {
					redirect: {
						permanent: false,
						destination: '/auth/signin',
					},
				};
			}
		}

		return await gssp(ctx);
	};
}
