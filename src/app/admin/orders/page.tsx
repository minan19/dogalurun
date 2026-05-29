import dynamic from "next/dynamic";
import { AdminHeader } from "@/components/admin/AdminHeader";

const AdminOrdersTable = dynamic(
  () => import("@/components/admin/AdminOrdersTable").then((m) => m.AdminOrdersTable),
  {
    loading: () => (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#556B2F] border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminOrdersTable />
      </div>
    </div>
  );
}
