import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function UseRMutation<T, B>(
  key: string,
  executer: (body: B) => Promise<{ data: T }>,
  invalidKey: string = '',
  onSuccess?: (data: any) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [key],
    mutationFn:executer,
    onSuccess: (data) => {
      
      if (onSuccess) {
        console.log(data);
        onSuccess(data);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [invalidKey] });
    },
    onError(error) {
      const err = error as AxiosError;
      toast.error((err.response?.data as { message: string })?.message);
    },
  });
}