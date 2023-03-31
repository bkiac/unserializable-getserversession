import {getServerAuthSession} from "@/server/auth";
import type {GetServerSidePropsContext} from "next";
import {signIn, signOut, useSession} from "next-auth/react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getServerAuthSession(context);
	console.log(session);
	return {props: {session}};
}

export default function Index() {
	const session = useSession();
	console.log(session);
	return (
		<div>
			<p>{session.data && <span>Logged in as {session.data.user.email}</span>}</p>
			<button onClick={session.data ? () => void signOut() : () => void signIn()}>
				{session.data ? "Sign out" : "Sign in"}
			</button>
		</div>
	);
}
