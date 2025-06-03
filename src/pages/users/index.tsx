import { PageContainer } from "@/components/common/PageContainer";
import { DataTable } from "@/components/common/DataTable";
import { useUsers } from "./hooks/useUsers";

export default function UsersPage() {
  const { users, isLoading, columns } = useUsers();

  return (
    <PageContainer title="Users">
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        pageSize={10}
      />
    </PageContainer>
  );
}
