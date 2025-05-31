import { createContext, useContext } from "react";
import { QueryClient } from "@tanstack/react-query";

export const QueryClientContext = createContext<QueryClient | undefined>(
  undefined
);

export const useQueryClient = () => {
  const queryClient = useContext(QueryClientContext);
  if (!queryClient) {
    throw new Error("useQueryClient must be used within a QueryClientProvider");
  }
  return queryClient;
};
