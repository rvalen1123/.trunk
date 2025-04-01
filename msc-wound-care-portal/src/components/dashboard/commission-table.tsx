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
  User,
} from "@nextui-org/react";
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

interface Commission {
  id: string;
  rep: {
    name: string;
    avatar: string;
    email: string;
  };
  facility: string;
  amount: number;
  status: string;
  date: string;
  orderNumber: string;
}

interface CommissionTableProps {
  commissions: Commission[];
  onAction: (action: string, commission: Commission) => void;
}

export default function CommissionTable({
  commissions,
  onAction,
}: CommissionTableProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(commissions.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return commissions.slice(start, end);
  }, [page, commissions]);

  const statusColorMap: Record<string, ChipProps["color"]> = {
    paid: "success",
    pending: "warning",
    processing: "primary",
    rejected: "danger",
  };

  const renderCell = React.useCallback(
    (commission: Commission, columnKey: React.Key) => {
      const cellValue = commission[columnKey as keyof Commission];

      switch (columnKey) {
        case "rep":
          return (
            <User
              name={commission.rep.name}
              description={commission.rep.email}
              avatarProps={{
                src: commission.rep.avatar,
              }}
            />
          );
        case "amount":
          return (
            <div className="flex items-center gap-1">
              <BanknotesIcon className="h-4 w-4 text-success-500" />
              <span className="font-medium">
                ${(commission.amount as number).toFixed(2)}
              </span>
            </div>
          );
        case "status":
          return (
            <Chip
              color={statusColorMap[commission.status.toLowerCase()] || "default"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "date":
          return (
            <p className="text-sm">
              {new Date(commission.date).toLocaleDateString()}
            </p>
          );
        case "actions":
          return (
            <div className="flex gap-1">
              <Tooltip content="View Details">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onAction("view", commission)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Approve">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="success"
                  isDisabled={commission.status !== "Pending"}
                  onPress={() => onAction("approve", commission)}
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Reject">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  isDisabled={commission.status !== "Pending"}
                  onPress={() => onAction("reject", commission)}
                >
                  <XMarkIcon className="h-4 w-4" />
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
      aria-label="Commission table"
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
        <TableColumn key="rep">SALES REP</TableColumn>
        <TableColumn key="facility">FACILITY</TableColumn>
        <TableColumn key="amount">AMOUNT</TableColumn>
        <TableColumn key="status">STATUS</TableColumn>
        <TableColumn key="date">DATE</TableColumn>
        <TableColumn key="orderNumber">ORDER #</TableColumn>
        <TableColumn key="actions">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody items={items} emptyContent={"No commissions found"}>
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
