"use client";

import {
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";
import { FiChevronDown } from "react-icons/fi";

export interface BaseMultiSelectOption {
    label: string;
    value: string;
}

interface BaseMultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: BaseMultiSelectOption[];
    width?: string | number;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    ariaLabel?: string;
}

export default function BaseMultiSelect({
    value,
    onChange,
    options,
    width = "100%",
    placeholder = "انتخاب کنید",
    disabled = false,
    error = false,
    ariaLabel = "انتخاب چندگانه",
}: BaseMultiSelectProps) {
    const handleChange = (
        event: SelectChangeEvent<string[]>,
    ) => {
        const selected = event.target.value;

        onChange(
            typeof selected === "string"
                ? selected.split(",")
                : selected,
        );
    };

    return (
        <Select
            multiple
            fullWidth
            value={value}
            onChange={handleChange}
            disabled={disabled}
            error={error}
            IconComponent={FiChevronDown}
            displayEmpty
            inputProps={{
                "aria-label": ariaLabel,
            }}
            renderValue={(selected) => {
                if (selected.length === 0) {
                    return (
                        <span className="text-gray-400">
                            {placeholder}
                        </span>
                    );
                }

                const labels = selected.map((item) => {
                    const option = options.find(
                        (option) =>
                            option.value === item,
                    );

                    return option?.label ?? item;
                });

                return (
                    <span
                        className="block overflow-hidden text-ellipsis whitespace-nowrap"
                        title={labels.join("، ")}
                    >
                        {labels.join("، ")}
                    </span>
                );
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
                            borderRadius: "12px",
                        },
                    },
                },
            }}
            sx={{
                height: 48,
                width,
                borderRadius: "12px",
                fontFamily: "var(--font-primary)",

                "& .MuiSelect-select": {
                    height: "48px",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    paddingTop: "0 !important",
                    paddingBottom: "0 !important",
                    paddingRight: "14px !important",
                    paddingLeft: "40px !important",
                    fontFamily: "var(--font-primary)",
                    fontSize: "14px",
                    lineHeight: "48px",
                },

                "& .MuiSelect-icon": {
                    left: 12,
                    right: "auto",
                    fontSize: 20,
                },

                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: error
                        ? "#ef4444"
                        : "#e5e7eb",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: error
                        ? "#ef4444"
                        : "#e5e7eb",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: error
                        ? "#ef4444"
                        : "var(--primary-color)",
                },
            }}
        >
            {options.map((option) => (
                <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                        fontFamily: "var(--font-primary)",
                        fontSize: "14px",
                    }}
                >
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
}