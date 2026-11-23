import {
  DefaultOptions,
  focusManager,
  QueryClient,
} from "@tanstack/react-query";
import { AppState } from "react-native";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 5 * 1000,
    gcTime: 1 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false, // Without this, queries that error would be retried 3 times automatically
  },
  mutations: {
    gcTime: Infinity,
  },
};

AppState.addEventListener("change", (nextAppState) => {
  // To be used with the `refetchOnWindowFocus` option
  focusManager.setFocused(nextAppState === "active");
});

export const queryClient = new QueryClient({
  defaultOptions,
});
