import { useQuery } from "@tanstack/react-query";

export const useRQ = (key: string, executer: Function) => {
  return useQuery({ 
    queryKey: [key],
    queryFn: async ()=>{
     const {data} = await executer() 
        return data
    },
    
    });
};
