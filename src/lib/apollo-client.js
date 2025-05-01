/**
 * This is a stub for the Apollo Client that was previously used.
 * The code now uses REST API instead of GraphQL.
 */

export function getApolloClient() {
  return {
    query: async () => {
      return { data: {} };
    },
  };
}

export function _createApolloClient() {
  return getApolloClient();
}
