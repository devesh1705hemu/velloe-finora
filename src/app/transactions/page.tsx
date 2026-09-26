"use client";

import { useState } from "react";
import {
  Download,
  Plus,
  Upload,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { PermissionGate, useTenant } from "@/features/tenant";
import {
  TransactionTable,
  TransactionFilters,
  TransactionDetailSheet,
  TransactionFormModal,
  TransactionDeleteDialog,
  TransactionImportModal,
  TransactionExportModal,
} from "@/features/transactions/components";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useImportTransactions,
} from "@/features/transactions/hooks";
import {
  Transaction,
  TransactionFilterState,
  SortField,
} from "@/features/transactions/types";
import { TransactionFormValues } from "@/features/transactions/schemas";

const DEFAULT_FILTER: TransactionFilterState = {
  search: "",
  type: "all",
  categoryId: "all",
  status: "all",
  dateRangePreset: "all",
  isLeakage: false,
  sortBy: "postedAt",
  sortOrder: "desc",
  page: 1,
  pageSize: 10,
};

export default function TransactionsPage() {
  const { currentWorkspace } = useTenant();
  const [filter, setFilter] = useState<TransactionFilterState>(DEFAULT_FILTER);

  // Modals & Sheets State
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Queries & Mutations
  const { data, isLoading, refetch, isFetching } = useTransactions(filter);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const importMutation = useImportTransactions();

  // Handlers
  const handleSort = (field: SortField) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilter(DEFAULT_FILTER);
  };

  const handleOpenCreate = () => {
    setEditingTx(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (tx: Transaction) => {
    setTxToDelete(tx);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (values: TransactionFormValues) => {
    if (editingTx) {
      await updateMutation.mutateAsync({ id: editingTx.id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setFormModalOpen(false);
    setEditingTx(null);
  };

  const handleDeleteConfirm = async () => {
    if (!txToDelete) return;
    await deleteMutation.mutateAsync(txToDelete.id);
    setDeleteDialogOpen(false);
    setTxToDelete(null);
  };

  const handleImportBatch = async (
    rows: Array<{
      postedAt: string;
      merchantName: string;
      amount: number;
      type: "income" | "expense" | "transfer";
      categoryName: string;
      accountName: string;
      description?: string;
      status: "settled" | "pending" | "flagged" | "reconciled";
    }>
  ) => {
    await importMutation.mutateAsync(rows);
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Transactions Ledger
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Double-entry reconciled accounting records for <strong>{currentWorkspace.name}</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Sync Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs gap-1.5 h-9"
              title="Refresh ledger feed"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            {/* CSV Import */}
            <PermissionGate permission="canEditTransactions">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportModalOpen(true)}
                className="text-xs gap-1.5 h-9"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import CSV</span>
              </Button>
            </PermissionGate>

            {/* Export Data */}
            <PermissionGate
              permission="canExportData"
              fallback={
                <Button variant="outline" size="sm" disabled className="text-xs h-9">
                  Export (Restricted)
                </Button>
              }
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportModalOpen(true)}
                className="text-xs gap-1.5 h-9"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            </PermissionGate>

            {/* Create Transaction */}
            <PermissionGate permission="canEditTransactions">
              <Button
                size="sm"
                onClick={handleOpenCreate}
                className="text-xs gap-1.5 h-9"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Entry</span>
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* Filters */}
        <TransactionFilters
          filter={filter}
          onChange={setFilter}
          onReset={handleResetFilters}
        />

        {/* Scalable Data Table */}
        <TransactionTable
          data={data}
          isLoading={isLoading}
          sortBy={filter.sortBy}
          sortOrder={filter.sortOrder}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onViewDetails={(tx) => {
            setSelectedTx(tx);
            setIsDetailOpen(true);
          }}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        {/* Transaction Audit Detail Sheet */}
        <TransactionDetailSheet
          transaction={selectedTx}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTx(null);
          }}
          onEdit={(tx) => {
            setIsDetailOpen(false);
            handleOpenEdit(tx);
          }}
          onDelete={(tx) => {
            setIsDetailOpen(false);
            handleOpenDelete(tx);
          }}
        />

        {/* Create / Edit Modal */}
        <TransactionFormModal
          isOpen={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingTx(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingTx}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Destructive Delete Confirmation Dialog */}
        <TransactionDeleteDialog
          transaction={txToDelete}
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setTxToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isPending}
        />

        {/* CSV Import Multi-step Modal */}
        <TransactionImportModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onImportConfirmed={handleImportBatch}
          isLoading={importMutation.isPending}
        />

        {/* Export Data Modal */}
        <TransactionExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          currentFilter={filter}
          totalFilteredRecords={data?.total ?? 0}
        />
      </div>
    </AppShell>
  );
}
