import { useQuery } from "@tanstack/react-query";
import { getBootstrapData } from "@/features/bootstrap/bootstrap-service";
import { useI18n } from "@/providers/use-i18n";

export function useBootstrapQuery() {
  const { locale } = useI18n();

  return useQuery({
    queryKey: ["bootstrap", locale],
    queryFn: () => getBootstrapData(locale)
  });
}
