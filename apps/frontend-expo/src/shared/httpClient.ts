import { create } from "axios";
import Constants from "expo-constants";

const BACKEND_PORT = 3000;

function resolveBaseUrl(): string {
  const devHost = Constants.expoConfig?.hostUri?.split(":")[0];
  return `http://${devHost ?? "localhost"}:${BACKEND_PORT}`;
}

export const httpClient = create({
  baseURL: resolveBaseUrl(),
  timeout: 10_000,
});
