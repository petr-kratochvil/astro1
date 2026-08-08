import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";

import { SavedDate } from "../types";

interface RecordSelectProps {
  records: SavedDate[];
  // Index into `records`, or undefined while nothing is selected yet.
  value: number | undefined;
  onChange: (index: number) => void;
}

export default function RecordSelect({
  records,
  value,
  onChange,
}: RecordSelectProps) {
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
      <Select
        // label={t("common.selectRecord")}
        value={value ?? ""}
        onChange={(event) => onChange(Number(event.target.value))}
        MenuProps={{ disableScrollLock: true }}
        sx={{marginLeft: "0.5em"}}
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
