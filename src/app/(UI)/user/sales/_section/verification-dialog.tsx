"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface VerificationDialogProps {
  isOpen: boolean
  onVerify: () => void
  onCancel: () => void
}

export default function VerificationDialog({  onVerify }: VerificationDialogProps) {
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)

  return (
    <>
      <Button onClick={() => setShowVerificationPrompt(true)} className="w-full h-12 text-base">
        Proceed
      </Button>

      <AlertDialog open={showVerificationPrompt} onOpenChange={setShowVerificationPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Details</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure the entered details are correct? After confirming, you cannot go back and edit previous
              information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1"
              onClick={() => {
                onVerify()
                setShowVerificationPrompt(false)
              }}
            >
              Confirm
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
