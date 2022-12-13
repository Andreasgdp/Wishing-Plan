import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';

import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (user.name) {
				return true;
			} else {
				// User has no custom name yet, redirect him
				return '/userInfo';
			}
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
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: {
					label: 'Username',
					type: 'text',
					placeholder: 'jsmith',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				// Add logic here to look up the user from the credentials supplied
				const user = await prisma.user.findUnique({
					where: {
						email: credentials!.email,
					},
				});
				if (!user) {
					throw new Error('No user found');
				}
				if (!user.password) {
					throw new Error('No password set');
				}
				const isPasswordCorrect = await bcrypt.compare(
					credentials!.password,
					user.password
				);
				if (!isPasswordCorrect) {
					throw new Error('Password incorrect');
				}
				// Any object returned will be saved in `user` property of the JWT
				return user;
			},
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
};

export default NextAuth(authOptions);
