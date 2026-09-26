import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Financial data is cached for 1 minute before refetching in background
        staleTime: 60 * 1000,
        // Retain garbage collected cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error: unknown) => {
          // Do not retry on client auth errors (401, 403, 404)
          if (
            typeof error === "object" &&
            error !== null &&
            "status" in error &&
            typeof (error as { status: unknown }).status === "number"
          ) {
            const status = (error as { status: number }).status;
            if ([401, 403, 404, 422].includes(status)) {
              return false;
            }
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        // Include pending queries in dehydration for SSR prefetching
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns the QueryClient instance.
 * On server: always creates a new QueryClient per request to avoid data leaking across users.
 * On client: reuses the singleton browser instance.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
