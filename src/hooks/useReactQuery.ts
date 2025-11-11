import { useQuery } from "@tanstack/react-query";

export function UseRQ<T>(key: string, executer: ()=>Promise<{data:T}>) {
  return useQuery({ 
    queryKey: [key],
    queryFn: async ()=>{
     const {data} = await executer() 
        return data
    },
    
    });
};
