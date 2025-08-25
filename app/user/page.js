'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Spinner from '../components/Spinner';
import styles from './User.module.css';

const columnHelper = createColumnHelper();

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const router = useRouter();

  const handleUserClick = useCallback((iidxId) => {
    router.push(`/data?iidxId=${encodeURIComponent(iidxId)}`);
  }, [router]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('djName', {
        header: 'Name',
        cell: info => (
          <button
            onClick={() => handleUserClick(info.row.original.iidxId)}
            className="hover:underline cursor-pointer"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('iidxId', {
        header: 'IIDX ID',
        cell: info => (
          <button
            onClick={() => handleUserClick(info.getValue())}
            className="hover:underline cursor-pointer"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('dpRank', {
        header: 'DP Rank',
        cell: info => info.getValue(),
      }),
    ],
    [handleUserClick]
  );

  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Player</h1>
        <div className="w-80">
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(String(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="Name or IIDX ID"
          />
        </div>
      </div>

      {loading ? (
        <Spinner message="데이터를 가져오는 중..." />
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>
            오류가 발생했습니다.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white overflow-hidden">
          <thead className="border-t border-b border-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="w-1/3 px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="text-gray-400">
                        {header.column.getIsSorted() === 'asc' ? '↑' : 
                          header.column.getIsSorted() === 'desc' ? '↓' : ' '}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="w-1/3 px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'<'}
              </button>
              <span className="px-4 py-1 text-sm text-gray-700">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>>'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
