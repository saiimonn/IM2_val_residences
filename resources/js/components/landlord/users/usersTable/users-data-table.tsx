import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Plus, Search, UserPlus } from 'lucide-react';
import { DataTableFacetedFilter } from '../../ui/data-table-faceted-filter';
import { DataTablePagination } from '../../ui/data-table-pagination';
import { UsersTableViewOptions } from './users-table-view-options';

interface UsersDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function UsersDataTable<TData, TValue>({ columns, data }: UsersDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const userTypeOptions = [
        { label: 'Tenant', value: 'tenant' },
        { label: 'Prospective Tenant', value: 'prospective_tenant' },
    ];

    const employmentOptions = [
        { label: 'Full-time', value: 'full_time' },
        { label: 'Part-time', value: 'part_time' },
        { label: 'Self-employed', value: 'self_employed' },
        { label: 'Unemployed', value: 'unemployed' },
        { label: 'Student', value: 'student' },
        { label: 'Retired', value: 'retired' },
    ];

    const hasActiveFilters = table.getState().columnFilters.length > 0;

    return (
        <div className="space-y-4">
            {/* Filters Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={(table.getColumn('user_name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('user_name')?.setFilterValue(event.target.value)}
                            className="h-8 w-[150px] pl-8 lg:w-[250px]"
                        />
                    </div>

                    <div className="relative">
                        <Input
                            placeholder="Search by email..."
                            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                            className="h-8 w-[150px] lg:w-[200px]"
                        />
                    </div>

                    {table.getColumn('user_type') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('user_type')}
                            title="User Type"
                            options={userTypeOptions}
                        />
                    )}

                    {table.getColumn('employment_status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('employment_status')}
                            title="Employment"
                            options={employmentOptions}
                        />
                    )}

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <Filter className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <UsersTableViewOptions table={table} />
                </div>
            </div>



            {/* Table Section */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-muted/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-muted-foreground">No users found.</div>
                                        <Button variant="outline" size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add your first user
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}
