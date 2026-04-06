import { useQuery } from "@tanstack/react-query";
import { listItems } from "@/features/items/items-service";
import { useI18n } from "@/providers/use-i18n";

export function useItemsQuery(bearerToken: string | null, enabled: boolean) {
  const { locale } = useI18n();

  return useQuery({
    queryKey: ["items", bearerToken, locale],
    queryFn: () => listItems(bearerToken, locale),
    enabled
  });
}
