import { type QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

export function UseRQ<T>(
  key: string | QueryKey,
  executer: () => Promise<{ data: T }>,
  options?: Omit<UseQueryOptions<T, Error, T>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const { data } = await executer();
      return data;
    },
    ...options,
  });
}
