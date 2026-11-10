"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface BaseDatePickerProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function BaseDatePicker({
    value,
    onChange,
    placeholder = "تاریخ را انتخاب کنید",
    disabled = false,
    className = "",
}: BaseDatePickerProps) {
    const pickerValue = value ? new Date(value) : "";

    return (
        <DatePicker
            value={pickerValue}
            onChange={(date) => {
                if (!date) {
                    onChange(null);
                    return;
                }

                onChange(date.toDate().toISOString());
            }}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            format="YYYY/MM/DD"
            disabled={disabled}
            placeholder={placeholder}
            containerClassName="w-full"
            className="custom-date-picker"
            inputClass={`
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-(--primary-color)
                focus:bg-white
                ${className}
            `}
        />
    );
}