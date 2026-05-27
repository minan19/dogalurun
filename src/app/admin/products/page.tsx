import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminProductsTable />
      </div>
    </div>
  );
}
