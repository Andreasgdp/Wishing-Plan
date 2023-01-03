import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { env } from '@env/server.mjs';
import { prisma } from '@server/db/client';
import { signInChecks } from '@server/trpc/utils/auth/signInUtils';

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		async signIn({ user }) {
			return await signInChecks(user);
		},
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: env.EMAIL_SERVER,
			from: env.EMAIL_FROM,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
	],
	theme: {
		colorScheme: 'auto', // "auto" | "dark" | "light"
		brandColor: '#ed64a6', // Hex color code
	},
	pages: {
		signIn: '/auth/signin',
	},
};

export default NextAuth(authOptions);
