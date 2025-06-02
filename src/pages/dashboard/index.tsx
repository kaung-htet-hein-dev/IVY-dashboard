import { useEffect } from "react";
import { Box, Paper, Typography, useTheme, Skeleton } from "@mui/material";
import {
  People as PeopleIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  MiscellaneousServices as ServicesIcon,
  BookOnline as BookingIcon
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface DashboardStats {
  totalUsers: number;
  totalCategories: number;
  totalBranches: number;
  totalServices: number;
  totalBookings: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({ title, value, icon, isLoading = false }: StatCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
        flex: 1,
        minWidth: {
          xs: "100%",
          sm: "calc(50% - 12px)",
          md: "calc(33.33% - 16px)",
          lg: "calc(20% - 16px)"
        }
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography color="text.secondary" variant="body2" gutterBottom>
          {title}
        </Typography>
        {isLoading ? (
          <Skeleton width={60} />
        ) : (
          <Typography variant="h5">{value}</Typography>
        )}
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await api.get<DashboardStats>("/api/v1/dashboard/stats");
      return response.data;
    }
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3
        }}
      >
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<PeopleIcon />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Categories"
          value={stats?.totalCategories || 0}
          icon={<CategoryIcon />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Branches"
          value={stats?.totalBranches || 0}
          icon={<StoreIcon />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Services"
          value={stats?.totalServices || 0}
          icon={<ServicesIcon />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={<BookingIcon />}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}
