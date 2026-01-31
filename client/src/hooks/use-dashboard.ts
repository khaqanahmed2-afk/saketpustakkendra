import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { api } from "@/services/api";

export function useDashboardData() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.mobile],
    queryFn: () => api.dashboard.getData(),
    enabled: !!user,
  });

  return {
    customer: data?.customer || null,
    ledger: data?.ledger || [],
    bills: data?.bills || [],
    payments: data?.payments || [],
    invoices: data?.invoices || [],
    monthly: data?.monthly || [],
    summary: data?.summary || { totalPurchases: 0, totalPaid: 0, currentBalance: 0 },
    isLoading: isLoading,
  };
}
