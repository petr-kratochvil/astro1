import { Box } from "@mui/material";
import React from "react";

interface ErrorMessageProps {
  isError?: boolean;
  message: string;
}

export default function ErrorMessage({
  isError = true,
  message,
}: ErrorMessageProps) {
  return isError ? <Box sx={{ color: "error.main", textAlign: "center", marginTop: "20px" }}>{message}</Box> : null;
}
