import { Box, Typography } from "@mui/material";
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
      {children}
    </Box>
  );
};
