import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/project/structure
export function useProjectStructure() {
  return useQuery({
    queryKey: [api.project.structure.path],
    queryFn: async () => {
      const res = await fetch(api.project.structure.path);
      if (!res.ok) throw new Error("Failed to fetch project structure");
      return api.project.structure.responses[200].parse(await res.json());
    },
  });
}

// GET /api/project/file?path=...
export function useProjectFile(path: string | null) {
  return useQuery({
    queryKey: [api.project.file.path, path],
    queryFn: async () => {
      if (!path) return null;
      // Using query param for path
      const url = `${api.project.file.path}?path=${encodeURIComponent(path)}`;
      const res = await fetch(url);
      
      if (res.status === 404) {
        throw new Error("File not found");
      }
      if (!res.ok) {
        throw new Error("Failed to fetch file content");
      }
      
      return api.project.file.responses[200].parse(await res.json());
    },
    enabled: !!path, // Only fetch if path is selected
  });
}
