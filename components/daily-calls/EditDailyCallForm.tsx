"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/lib/supabase"
import { useDailyCallsStore } from "@/store/useDailyCallsStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  call_date: z.string().min(1, "Date is required"),
  workiz_id: z.string().min(1, "Workiz ID is required"),
  job_description: z.string().optional(),
  category: z.enum(["Relevant", "Spam", "Not Relevant"]),
  customer_phone: z.string().min(10, "Valid phone number required"),
})

type FormValues = z.infer<typeof formSchema>

export function EditDailyCallForm({ onSuccess }: { onSuccess: () => void }) {
  const { selectedCall, isEditModalOpen, setEditModalOpen, setSelectedCall } =
    useDailyCallsStore()
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      call_date: "",
      workiz_id: "",
      job_description: "",
      category: "Relevant",
      customer_phone: "",
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const categoryValue = watch("category")

  // Pre-fill form when selectedCall changes
  useEffect(() => {
    if (selectedCall) {
      reset({
        call_date: selectedCall.call_date,
        workiz_id: selectedCall.workiz_id,
        job_description: selectedCall.job_description || "",
        category: selectedCall.category,
        customer_phone: selectedCall.customer_phone,
      })
    }
  }, [selectedCall, reset])

  const handleOpenChange = (open: boolean) => {
    setEditModalOpen(open)
    if (!open) {
      setSelectedCall(null)
      setErrorMsg("")
    }
  }

  async function onSubmit(values: FormValues) {
    if (!selectedCall) return

    setLoading(true)
    setErrorMsg("")

    const { error } = await supabase
      .from("daily_calls")
      .update(values)
      .eq("id", selectedCall.id)

    if (error) {
      if (error.code === "23505") {
        setErrorMsg("This customer has already been logged today.")
      } else {
        setErrorMsg(error.message)
      }
      setLoading(false)
      return
    }

    setLoading(false)
    setEditModalOpen(false)
    setSelectedCall(null)
    onSuccess()
  }

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Logged Call</DialogTitle>
          <DialogDescription>
            Update the details of the selected call.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {errorMsg}
          </div>
        )}

        <ScrollArea className="-mr-4 flex-1 overflow-y-auto pr-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-1 pb-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit_call_date">Date</Label>
              <Input id="edit_call_date" type="date" {...register("call_date")} />
              {errors.call_date && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.call_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_customer_phone">Customer Phone</Label>
              <Input
                id="edit_customer_phone"
                placeholder="(555) 555-5555"
                {...register("customer_phone")}
              />
              {errors.customer_phone && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.customer_phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_workiz_id">Workiz ID</Label>
              <Input
                id="edit_workiz_id"
                placeholder="WKZ-12345"
                {...register("workiz_id")}
              />
              {errors.workiz_id && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.workiz_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={categoryValue}
                onValueChange={(value: "Relevant" | "Spam" | "Not Relevant") =>
                  setValue("category", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Relevant">Relevant</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Not Relevant">Not Relevant</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_job_description">Job Description</Label>
              <Input
                id="edit_job_description"
                placeholder="Air duct cleaning inquiry..."
                {...register("job_description")}
              />
              {errors.job_description && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.job_description.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Call"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
