"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const UseHookForm = <T extends z.ZodSchema>(
  schema: T,
  mutation: Function,
  defaultValues?: z.infer<T>
) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const { handleSubmit, formState, ...rest } = form;

  const onFormSubmit = handleSubmit(
    async (values) => {mutation(values)},
    (err) => {
      Object.values(err).forEach((error: any) => {
        if (error?.message) toast.error(error.message.toString());
      });
    }
  );

  return { form, formState,errors:formState.errors, onFormSubmit, ...rest };
};