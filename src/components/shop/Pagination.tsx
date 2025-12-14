'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-lg border transition-colors
          ${currentPage === 1
            ? 'border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 dark:border-gray-700 text-dark dark:text-dark-text hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513]'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-dark dark:text-dark-text hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513] transition-colors"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            px-4 py-2 rounded-lg border transition-colors font-medium
            ${page === currentPage
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 dark:border-gray-700 text-dark dark:text-dark-text hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513]'
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-dark dark:text-dark-text hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-lg border transition-colors
          ${currentPage === totalPages
            ? 'border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 dark:border-gray-700 text-dark dark:text-dark-text hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513]'
          }
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
