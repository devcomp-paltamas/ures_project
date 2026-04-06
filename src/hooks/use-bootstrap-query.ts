import { useQuery } from "@tanstack/react-query";
import { getBootstrapData } from "@/features/bootstrap/bootstrap-service";

export function useBootstrapQuery() {
  return useQuery({
    queryKey: ["bootstrap"],
    queryFn: getBootstrapData
  });
}
