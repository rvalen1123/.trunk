"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Tooltip,
  Button,
  Pagination,
} from "@nextui-org/react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  patient: string;
}

interface DocumentListProps {
  documents: Document[];
  onAction: (action: string, document: Document) => void;
}

export default function DocumentList({
  documents,
  onAction,
}: DocumentListProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(documents.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return documents.slice(start, end);
  }, [page, documents]);

  const statusColorMap: Record<string, ChipProps["color"]> = {
    completed: "success",
    pending: "warning",
    processing: "primary",
    draft: "default",
    rejected: "danger",
  };

  const typeIconMap: Record<string, React.ReactNode> = {
    "Prior Auth": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-500">
        PA
      </div>
    ),
    Agreement: (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success-100 text-success-500">
        AG
      </div>
    ),
    Order: (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning-100 text-warning-500">
        OR
      </div>
    ),
    Report: (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-100 text-secondary-500">
        RP
      </div>
    ),
  };

  const renderCell = React.useCallback(
    (document: Document, columnKey: React.Key) => {
      const cellValue = document[columnKey as keyof Document];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-2">
              {typeIconMap[document.type] || (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  DOC
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium">{cellValue}</p>
                <p className="text-xs text-gray-500">{document.patient}</p>
              </div>
            </div>
          );
        case "status":
          return (
            <Chip
              color={statusColorMap[document.status.toLowerCase()] || "default"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "createdAt":
          return (
            <p className="text-sm">
              {new Date(document.createdAt).toLocaleDateString()}
            </p>
          );
        case "actions":
          return (
            <div className="flex gap-1">
              <Tooltip content="View">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onAction("view", document)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Edit">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onAction("edit", document)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Download">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onAction("download", document)}
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Delete">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => onAction("delete", document)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <Table
      aria-label="Document list"
      bottomContent={
        pages > 1 ? (
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
        ) : null
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="name">DOCUMENT</TableColumn>
        <TableColumn key="type">TYPE</TableColumn>
        <TableColumn key="status">STATUS</TableColumn>
        <TableColumn key="createdAt">DATE</TableColumn>
        <TableColumn key="actions">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody items={items} emptyContent={"No documents found"}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
