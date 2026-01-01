import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import React from "react"
import { Button } from "@/components/ui/button"
interface categoryProps<T>{
  contents:string|React.ReactNode[],
  data:T,
  style?:string,action:Function
}  
   function AlertModal<T extends Record<string,T>>({data,contents,style,action}:categoryProps<T>) {
    
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline' className={style}>{contents[0]}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
            {contents[1]}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-500 hover:cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>action(data._id)}>Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  export default React.memo(AlertModal)