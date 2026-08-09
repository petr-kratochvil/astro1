import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";

import { SavedDate } from "src/types";
import { useTranslation } from "react-i18next";
import { useId } from "react";
import { InputLabel } from "@mui/material";

interface RecordSelectProps {
  records: SavedDate[];
  value: number | undefined;
  onChange: (index: number) => void;
}

export default function RecordSelect({
  records,
  value,
  onChange,
}: RecordSelectProps) {
  const { t } = useTranslation();
  const labelId = useId();

  return (
    <FormControl
      size="small"
      sx={(theme) => ({
        minWidth: 220,
        // Match the outlined date-navigation buttons
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.primary.main, 0.5),
        },
        "@media (hover: hover)": {
          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        },
      })}
    >
      <InputLabel
        id={labelId}
        sx={(theme) => ({
          color: alpha(theme.palette.primary.main, 0.75),
          "&.Mui-focused": {
            color: theme.palette.primary.main,
          },
        })}
      >
        {t("common.selectRecord")}
      </InputLabel>
      <Select
        labelId={labelId}
        label={t("common.selectRecord")}
        value={value ?? ""}
        onChange={(event) => onChange(Number(event.target.value))}
        MenuProps={{ disableScrollLock: true }}
      >
        {records.map((record, index) => (
          <MenuItem key={index} value={index}>
            {record.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
