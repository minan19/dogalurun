import { AdminHeader } from "@/components/admin/AdminHeader";
import { AiPanel } from "@/components/admin/AiPanel";
import { SalesPanel } from "@/components/admin/SalesPanel";
import { StockAlerts } from "@/components/admin/StockAlerts";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Ana içerik */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <StockAlerts />
          <AiPanel />
        </div>
        {/* Sağ panel */}
        <div className="w-72 shrink-0 border-l border-[#d8e4c8] overflow-y-auto bg-white p-5">
          <SalesPanel />
        </div>
      </div>
    </div>
  );
}
