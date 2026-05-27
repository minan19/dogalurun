import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBlogTable } from "@/components/admin/AdminBlogTable";

export default function AdminBlogPage() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminBlogTable />
      </div>
    </div>
  );
}
