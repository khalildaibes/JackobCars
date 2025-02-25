"use client";
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type DatePickerProps = Partial<{
  placeholder: string;
  className: string;
  value: string;
  dateFormat: string;
  onChange: Function;
  [x: string]: any;
}>;

function DatePicker({
  placeholder = "Select date",
  className,
  value,
  dateFormat = "dd/MM/yyyy",
  onChange,
  ...restProps
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState(value);

  const onDateChange = (value: Date | null) => {
    const newValue = value instanceof Date ? value.toISOString() : "";
    setSelectedDate(newValue);
    onChange?.(newValue);
  };

  return (
    <>
      <div className={className}>
        <ReactDatePicker
          dateFormat={dateFormat}
          placeholderText={placeholder}
          selected={selectedDate ? new Date(selectedDate) : null}
          onChange={onDateChange}
          {...restProps}
        />
      </div>
    </>
  );
}

function DatePickerRange({
  startDate,
  endDate,
  placeholder = "Select range",
  className,
  dateFormat = "dd/MM/yyyy",
  onChange,
  ...restProps
}: DatePickerProps) {
  const [startDateValue, setStartDate] = React.useState(startDate);
  const [endDateValue, setEndDate] = React.useState(endDate);

  const onDateChange = ([start, end]: (Date | null)[]) => {
    const newStartDate = start instanceof Date ? start.toISOString() : start;
    const newEndDate = end instanceof Date ? end.toISOString() : end;
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onChange?.([newStartDate, newEndDate]);
  };

  return (
    <>
      <div className={className}>
        <ReactDatePicker
          dateFormat={dateFormat}
          placeholderText={placeholder}
          startDate={startDateValue ? new Date(startDateValue) : null}
          endDate={endDateValue ? new Date(endDateValue) : null}
          onChange={onDateChange}
          selectsRange
          {...restProps}
        />
      </div>
    </>
  );
}

DatePicker.Range = DatePickerRange;
DatePicker.DateTime = (props: DatePickerProps) => (
  <DatePicker dateFormat="dd/MM/yyyy h:mm aa" showTimeSelect {...props} />
);
DatePicker.Time = (props: DatePickerProps) => (
  <DatePicker dateFormat="h:mm aa" showTimeSelect showTimeSelectOnly {...props} />
);

export { DatePicker };
