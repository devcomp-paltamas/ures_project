import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/features/preferences/preferences-service";

export function useProfileQuery(bearerToken: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["profile", bearerToken],
    queryFn: () => getProfile(bearerToken),
    enabled
  });
}
