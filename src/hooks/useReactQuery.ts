import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function UseRQ<T>(key: string, executer: ()=>Promise<{data:T}>, options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>
) {
  return useQuery({ 
    queryKey: [key],
    queryFn: async ()=>{
     const {data} = await executer() 
        return data
    },
        ...options,
    });
};
