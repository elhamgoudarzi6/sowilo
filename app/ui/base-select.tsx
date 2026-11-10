
"use client";

import {
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FiChevronDown } from "react-icons/fi";

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  width?: string | number;
  placeholder?: string;
  disabled?: boolean;
}

export default function BaseSelect({
  value,
  onChange,
  options,
  width = "100%",
  placeholder,
  disabled = false,
}: AppSelectProps) {
  const handleChange = (
    event: SelectChangeEvent<string>,
  ) => {
    onChange(event.target.value);
  };

  return (
    <Select
      fullWidth
      value={value}
      onChange={handleChange}
      displayEmpty
      IconComponent={FiChevronDown}
      renderValue={(selected) => {
        if (!selected && placeholder) {
          return (
            <span style={{ color: "var(--color-text-secondary)" }}>
              {placeholder}
            </span>
          );
        }

        const selectedOption = options.find(
          (option) => option.value === selected,
        );

        return selectedOption?.label ?? "";
      }}
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        slotProps: {
          paper: {
            sx: {
              mt: 1,
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              backgroundColor: "var(--color-surface)",
              boxShadow: "0 8px 28px rgba(48, 33, 36, 0.08)",
              overflow: "hidden",
              "& .MuiList-root": {
                padding: "6px",
              },
            },
          },
        },
      }}
      sx={{
        height: 48,
        width,
        borderRadius: "12px",
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        fontFamily: "var(--font-primary)",
        fontSize: "13px",
        transition: "all 180ms ease",

        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          minHeight: "unset",
          padding: "12px 14px",
          paddingLeft: "38px",
          fontFamily: "var(--font-primary)",
          fontSize: "13px",
          color: "var(--color-text)",
        },

        "& .MuiSelect-icon": {
          left: 12,
          right: "auto",
          color: "var(--color-text-secondary)",
          fontSize: 19,
          transition: "transform 180ms ease",
        },

        "& .MuiSelect-iconOpen": {
          transform: "rotate(180deg)",
          color: "var(--color-primary)",
        },

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--color-border)",
          transition: "border-color 180ms ease",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--color-border-strong, var(--color-border))",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--color-primary)",
          borderWidth: "1px",
        },

        "&.Mui-focused": {
          boxShadow: "0 0 0 3px rgba(142, 38, 56, 0.08)",
        },

        "&.Mui-disabled": {
          backgroundColor: "var(--color-background)",
          color: "var(--color-text-secondary)",
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            minHeight: "42px",
            borderRadius: "8px",
            margin: "2px 0",
            padding: "9px 12px",
            fontFamily: "var(--font-primary)",
            fontSize: "13px",
            color: "var(--color-text)",
            transition: "all 150ms ease",

            "&:hover": {
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
            },

            "&.Mui-selected": {
              backgroundColor: "var(--color-accent)",
              color: "var(--color-primary)",
              fontWeight: 700,
            },

            "&.Mui-selected:hover": {
              backgroundColor: "var(--color-accent)",
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
