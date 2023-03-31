import {z} from "zod";

const server = z.object({
	PORT: z.string().min(1).default("3000"),

	DATABASE_URL: z.string().url(),

	NEXTAUTH_SECRET: z.string().min(1),
	NEXTAUTH_URL: z.preprocess(
		// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
		// Since NextAuth.js automatically uses the VERCEL_URL if present.
		(str) => process.env["VERCEL_URL"] ?? str,
		// VERCEL_URL doesn't include `https` so it cant be validated as a URL
		process.env.VERCEL ? z.string().min(1) : z.string().url(),
	),

	EMAIL_SERVER_USER: z.string().min(1),
	EMAIL_SERVER_PASSWORD: z.string().min(1),
	EMAIL_SERVER_HOST: z.string().min(1),
	EMAIL_SERVER_PORT: z.string().min(1),
	EMAIL_FROM: z.string().min(1),
});

const client = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]), // NODE_ENV is a special env that is always available
});

/**
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
	NODE_ENV: process.env.NODE_ENV,

	PORT: process.env["PORT"],

	DATABASE_URL: process.env["DATABASE_URL"],

	NEXTAUTH_SECRET: process.env["NEXTAUTH_SECRET"],
	NEXTAUTH_URL: process.env["NEXTAUTH_URL"],

	EMAIL_SERVER_USER: process.env["EMAIL_SERVER_USER"],
	EMAIL_SERVER_PASSWORD: process.env["EMAIL_SERVER_PASSWORD"],
	EMAIL_SERVER_HOST: process.env["EMAIL_SERVER_HOST"],
	EMAIL_SERVER_PORT: process.env["EMAIL_SERVER_PORT"],
	EMAIL_FROM: process.env["EMAIL_FROM"],
};

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env["SKIP_ENV_VALIDATION"] == false) {
	const isServer = typeof window === "undefined";

	const parsed = /** @type {MergedSafeParseReturn} */ (
		isServer
			? merged.safeParse(processEnv) // on server we can validate all env vars
			: client.safeParse(processEnv) // on client we can only validate the ones that are exposed
	);

	if (!parsed.success) {
		console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
		throw new Error("Invalid environment variables");
	}
}

export {env};
