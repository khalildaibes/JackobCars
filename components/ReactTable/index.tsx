"use client";
import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from "@tanstack/react-table";

type ReactTableProps<D extends unknown> = {
  data: D[];
  columns: ColumnDef<D, any>[];
  headerProps?: {};
  headerCellProps?: {};
  bodyProps?: {};
  rowDataProps?: { className: string };
  cellProps?: { className: string };

  [x: string]: any;
};

const ReactTable = <D extends unknown>({
  columns,
  data = [],
  headerProps = {},
  headerCellProps = {},
  bodyProps = {},
  className = "",
  rowDataProps = { className: "" },
  cellProps = { className: "" },

  ...restConfig
}: ReactTableProps<D>) => {
  const tableConfig = {
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...restConfig,
  };

  const table = useReactTable(tableConfig);

  // Render the UI for your table
  return (
    <table className={className}>
      <thead {...headerProps}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} {...header.column.columnDef?.meta} {...headerCellProps}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...bodyProps}>
        {table.getRowModel().rows.map((row) => (
          <tr {...rowDataProps} className={`${rowDataProps?.className}`} key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={`${cellProps?.className}`}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { ReactTable };
