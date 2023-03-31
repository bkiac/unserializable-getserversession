// See https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
import {env} from "@/env.mjs";
import {PrismaClient} from "@prisma/client";
import type {Prisma} from "@prisma/client";

const globalForPrisma = global as unknown as {prisma?: PrismaClient};

function getLogLevel(): Pick<Prisma.PrismaClientOptions, "log"> {
	if (env.NODE_ENV === "development") {
		return {log: ["query", "error", "warn"]};
	}
	if (env.NODE_ENV === "production") {
		return {log: ["error"]};
	}
	return {};
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(getLogLevel());

if (env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export type PrismaTx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];
