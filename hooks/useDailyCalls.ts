import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { DailyCall } from "@/components/daily-calls/DailyCallsTable"

export const dailyCallsKeys = {
  all: ["daily_calls"] as const,
}

export function useDailyCalls() {
  return useQuery({
    queryKey: dailyCallsKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_calls")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(500)

      if (error) throw error
      return data as DailyCall[]
    },
  })
}

export function useAddDailyCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCall: Partial<DailyCall>) => {
      const { data, error } = await supabase
        .from("daily_calls")
        .insert([newCall])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyCallsKeys.all })
    },
  })
}

export function useUpdateDailyCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<DailyCall> }) => {
      const { data, error } = await supabase
        .from("daily_calls")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyCallsKeys.all })
    },
  })
}

export function useDeleteDailyCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from("daily_calls")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyCallsKeys.all })
    },
  })
}
