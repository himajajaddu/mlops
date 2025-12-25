import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertPrediction } from "@shared/routes";

// GET /api/predictions
export function usePredictions() {
  return useQuery({
    queryKey: [api.predictions.list.path],
    queryFn: async () => {
      const res = await fetch(api.predictions.list.path);
      if (!res.ok) throw new Error("Failed to fetch predictions");
      return api.predictions.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/predictions/stats
export function usePredictionStats() {
  return useQuery({
    queryKey: [api.predictions.stats.path],
    queryFn: async () => {
      const res = await fetch(api.predictions.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.predictions.stats.responses[200].parse(await res.json());
    },
  });
}

// POST /api/predictions
export function useCreatePrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPrediction) => {
      // Ensure the input matches schema (z.coerce should handle strings from inputs, but we validate here too)
      const validated = api.predictions.create.input.parse(data);
      
      const res = await fetch(api.predictions.create.path, {
        method: api.predictions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.predictions.create.responses[400].parse(await res.json());
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create prediction");
      }

      return api.predictions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.predictions.stats.path] });
    },
  });
}
