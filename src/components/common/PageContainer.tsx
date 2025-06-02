import { Box, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

export const PageContainer = ({ title, children }: PageContainerProps) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Paper sx={{ p: 2 }}>{children}</Paper>
    </Box>
  );
};
