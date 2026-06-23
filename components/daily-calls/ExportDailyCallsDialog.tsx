"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { supabase } from "@/lib/supabase"
import { DailyCall } from "./DailyCallsTable"
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
import { Download } from "lucide-react"

export function ExportDailyCallsDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Default filter: Last 7 days to Today
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [category, setCategory] = useState<string>("All")

  const handleExport = async () => {
    setLoading(true)
    setErrorMsg("")

    let query = supabase
      .from("daily_calls")
      .select("*")
      .gte("call_date", startDate)
      .lte("call_date", endDate)
      .order("call_date", { ascending: false })

    if (category !== "All") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setErrorMsg("No calls found for the selected filters.")
      setLoading(false)
      return
    }

    generatePdf(data)
    setLoading(false)
    setOpen(false)
  }

  const generatePdf = (calls: DailyCall[]) => {
    const doc = new jsPDF()

    // Header styling matching project themes
    // Foreground color (#0B1A1D)
    doc.setFontSize(22)
    doc.setTextColor(11, 26, 29) 
    doc.text("Daily Sheet Report", 14, 22)
    
    // Subtitle
    doc.setFontSize(11)
    doc.setTextColor(74, 116, 128) // Muted Foreground (#4A7480)
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 30)
    if (category !== "All") {
      doc.text(`Category: ${category}`, 14, 36)
    }

    // Table Data
    const tableColumn = ["Date", "Workiz ID", "Phone", "Category", "Description"]
    const tableRows = calls.map((call) => [
      call.call_date,
      call.workiz_id,
      call.customer_phone,
      call.category,
      call.job_description || "-",
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: category !== "All" ? 42 : 36,
      theme: "striped",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5,
        lineColor: [226, 232, 240], // Border color (#e2e8f0)
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [54, 179, 206], // Primary Color (#36B3CE)
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [232, 244, 246], // Accent/Secondary Color (#E8F4F6)
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: "auto" }
      }
    })

    doc.save(`Daily_Sheet_Report_${format(new Date(), "yyyyMMdd")}.pdf`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-secondary/30">
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Daily Calls</DialogTitle>
          <DialogDescription>
            Select the date range and category to generate a PDF report.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Relevant">Relevant</SelectItem>
                <SelectItem value="Spam">Spam</SelectItem>
                <SelectItem value="Not Relevant">Not Relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleExport} disabled={loading} className="w-full">
          {loading ? "Generating..." : "Download PDF"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
