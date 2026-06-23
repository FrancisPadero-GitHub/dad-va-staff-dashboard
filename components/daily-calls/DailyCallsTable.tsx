"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { AgGridReact } from "ag-grid-react"
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community"

import { Badge } from "@/components/ui/badge"
import { useDailyCallsStore } from "@/store/useDailyCallsStore"

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule])

// Create a custom theme using the CSS variables from globals.css
const appTheme = themeQuartz.withParams({
  backgroundColor: "var(--card)",
  foregroundColor: "var(--card-foreground)",
  borderColor: "var(--border)",
  headerBackgroundColor: "var(--muted)",
  headerTextColor: "var(--muted-foreground)",
  rowHoverColor: "var(--accent)",
  selectedRowBackgroundColor: "var(--secondary)",
  fontFamily: "var(--font-sans)",
  wrapperBorderRadius: "var(--radius-md)",
  browserColorScheme: "dark",
})

export type DailyCall = {
  id: number
  created_at: string
  call_date: string
  workiz_id: string
  job_description: string | null
  category: "Relevant" | "Spam" | "Not Relevant"
  customer_phone: string
}

export function DailyCallsTable({
  refreshTrigger,
}: {
  refreshTrigger: number
}) {
  const [calls, setCalls] = useState<DailyCall[]>([])
  const [loading, setLoading] = useState(true)

  const { setSelectedCall, setEditModalOpen } = useDailyCallsStore()

  const fetchCalls = useCallback(async () => {
    setLoading(true)

    // Fetch up to 500 recent calls to let AG Grid handle filtering/pagination client-side
    const { data, error } = await supabase
      .from("daily_calls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)

    if (!error && data) {
      setCalls(data as DailyCall[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCalls()
  }, [fetchCalls, refreshTrigger])

  const colDefs = useMemo<ColDef<DailyCall>[]>(
    () => [
      { field: "call_date", headerName: "Date", sortable: true, filter: true },
      {
        field: "workiz_id",
        headerName: "Workiz ID",
        sortable: true,
        filter: true,
      },
      {
        field: "customer_phone",
        headerName: "Phone",
        sortable: true,
        filter: true,
      },
      {
        field: "category",
        headerName: "Category",
        sortable: true,
        filter: true,
        cellRenderer: (params: ICellRendererParams<DailyCall, string>) => {
          const category = params.value
          switch (category) {
            case "Relevant":
              return (
                <Badge
                  variant="default"
                  className="my-1 bg-green-600 leading-none text-white hover:bg-green-700"
                >
                  Relevant
                </Badge>
              )
            case "Spam":
              return (
                <Badge
                  variant="secondary"
                  className="my-1 bg-stone-300 leading-none text-stone-800 hover:bg-stone-400"
                >
                  Spam
                </Badge>
              )
            case "Not Relevant":
              return (
                <Badge variant="destructive" className="my-1 leading-none">
                  Not Relevant
                </Badge>
              )
            default:
              return (
                <Badge variant="outline" className="my-1 leading-none">
                  {category}
                </Badge>
              )
          }
        },
      },
      {
        field: "job_description",
        headerName: "Job Description",
        sortable: true,
        filter: true,
        flex: 1,
      },
    ],
    []
  )

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      minWidth: 100,
      filterParams: {
        buttons: ["apply", "clear"],
      },
    }
  }, [])

  return (
    <div className="space-y-4">
      <div
        className="w-full overflow-hidden rounded-md border"
        style={{ height: "75vh", maxHeight: "600px" }}
      >
        <AgGridReact
          theme={appTheme}
          rowData={calls}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          onRowClicked={(e) => {
            if (e.data) {
              setSelectedCall(e.data)
              setEditModalOpen(true)
            }
          }}
          rowSelection="single"
          loading={loading}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading calls...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No calls logged yet.</span>'
          }
        />
      </div>
    </div>
  )
}
