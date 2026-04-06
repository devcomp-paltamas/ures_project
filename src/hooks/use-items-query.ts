import { useQuery } from "@tanstack/react-query";
import { listItems } from "@/features/items/items-service";

export function useItemsQuery(bearerToken: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["items", bearerToken],
    queryFn: () => listItems(bearerToken),
    enabled
  });
}
