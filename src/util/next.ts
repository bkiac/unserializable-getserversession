import type {GetServerSidePropsContext} from "next";

export type NextContext = Pick<GetServerSidePropsContext, "req" | "res">;
