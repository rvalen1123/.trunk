"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  ChipProps,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface DataTableProps {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
  }[];
  data: any[];
  statusOptions?: {
    [key: string]: ChipProps;
  };
  onRowAction?: (action: "view" | "edit" | "delete", item: any) => void;
}

export default function DataTable({
  columns,
  data,
  statusOptions,
  onRowAction,
}: DataTableProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(data.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as string];

      if (columnKey === "status" && statusOptions) {
        const status = cellValue?.toLowerCase();
        const chipProps = statusOptions[status] || {};

        return (
          <Chip
            size="sm"
            variant="flat"
            color={chipProps.color || "default"}
            {...chipProps}
          >
            {cellValue}
          </Chip>
        );
      }

      if (columnKey === "actions" && onRowAction) {
        return (
          <div className="flex gap-2">
            <Tooltip content="View">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onRowAction("view", item)}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onRowAction("edit", item)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onRowAction("delete", item)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        );
      }

      return cellValue;
    },
    [statusOptions, onRowAction]
  );

  return (
    <div className="w-full">
      <Table
        aria-label="Data table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} allowsSorting={column.sortable}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={"No data to display"}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
