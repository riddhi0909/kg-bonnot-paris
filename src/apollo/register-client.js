import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { createApolloClient } from "./apollo-client-factory";

/**
 * RSC / SSR client: public catalog (no JWT). Authenticated GraphQL uses
 * browser Apollo → /api/graphql (httpOnly cookie).
 */
export const { getClient, query, PreloadQuery } = registerApolloClient(() =>
  createApolloClient({
    fetchCache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
  }),
);
