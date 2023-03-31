import {getServerSession, type NextAuthOptions, type DefaultSession} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {prisma} from "@/server/db";
import type {NextContext} from "@/util/next";
import EmailProvider from "next-auth/providers/email";
import {env} from "@/env.mjs";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			email?: string | null;
		};
	}
}

export const authOptions: NextAuthOptions = {
	debug: env.NODE_ENV === "development",
	callbacks: {
		session({session, user}) {
			if (session.user) {
				session.user.id = user.id;
				session.user.email = user.email ?? null;
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: {
				host: env.EMAIL_SERVER_HOST,
				port: env.EMAIL_SERVER_PORT,
				auth: {
					user: env.EMAIL_SERVER_USER,
					pass: env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: env.EMAIL_FROM,
		}),
	],
};

export function getServerAuthSession(ctx: NextContext) {
	return getServerSession(ctx.req, ctx.res, authOptions);
}
