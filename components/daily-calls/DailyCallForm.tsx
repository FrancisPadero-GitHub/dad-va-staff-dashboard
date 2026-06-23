"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { PostgrestError } from "@supabase/supabase-js"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddDailyCall } from "@/hooks/useDailyCalls"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Phone } from "lucide-react"

const formSchema = z.object({
  call_date: z.string().min(1, "Date is required"),
  workiz_id: z.string().min(1, "Workiz ID is required"),
  job_description: z.string().optional(),
  category: z.enum(["Relevant", "Spam", "Not Relevant"]),
  customer_phone: z.string().min(10, "Valid phone number required"),
})

type FormValues = z.infer<typeof formSchema>

export function DailyCallForm() {
  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const { mutateAsync: addCall, isPending: loading } = useAddDailyCall()

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
      call_date: new Date().toISOString().split("T")[0],
      workiz_id: "",
      job_description: "",
      category: "Relevant",
      customer_phone: "",
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const categoryValue = watch("category")

  async function onSubmit(values: FormValues) {
    setErrorMsg("")

    try {
      await addCall(values)
      setOpen(false)
      reset({
        ...values,
        workiz_id: "",
        job_description: "",
        customer_phone: "",
      })
    } catch (err) {
      const error = err as PostgrestError;
      if (error.code === "23505") {
        setErrorMsg("This customer has already been logged today.")
      } else {
        setErrorMsg(error.message)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild> 
        <Button className="gap-2">
          <Phone className="h-4 w-4" /> Add Call
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Daily Call</DialogTitle>
          <DialogDescription>
            Enter the details of the call. Ensure the caller hasn&apos;t been
            logged today.
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
              <Label htmlFor="call_date">Date</Label>
              <Input id="call_date" type="date" {...register("call_date")} />
              {errors.call_date && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.call_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_phone">Customer Phone</Label>
              <Input
                id="customer_phone"
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
              <Label htmlFor="workiz_id">Workiz ID</Label>
              <Input
                id="workiz_id"
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
                  setValue("category", value, { shouldDirty: true })
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
              <Label htmlFor="job_description">Job Description</Label>
              <Input
                id="job_description"
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
              {loading ? "Saving..." : "Save Call"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
