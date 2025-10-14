import React from "react";
import { useTheme } from '../context/ThemeContext';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const { isDarkTheme } = useTheme();
    
    // Generate page numbers with ellipsis for better UX
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = 5;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4;
        }

        // Always show first page
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }

        // Main page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Always show last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`pagination-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <button 
                className="pagination-button pagination-prev"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <span className="button-icon">←</span>
                Previous
            </button>

            <div className="pagination-numbers">
                {pageNumbers.map((number, index) => 
                    number === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                            •••
                        </span>
                    ) : (
                        <button 
                            key={number}
                            className={`pagination-button pagination-number ${
                                currentPage === number ? "active" : ""
                            }`}
                            onClick={() => onPageChange(number)}
                        >
                            {number}
                        </button>
                    )
                )}
            </div>

            <button 
                className="pagination-button pagination-next"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
                <span className="button-icon">→</span>
            </button>
        </div>
    );
};

export default PaginationComponent;