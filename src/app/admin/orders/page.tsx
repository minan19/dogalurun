import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="p-6 text-sm text-[#5A5E52]">Yükleniyor...</div>}>
          <AdminOrdersTable />
        </Suspense>
      </div>
    </div>
  );
}
