import { Pagination } from 'react-bootstrap';

function PaginationBar({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    const items = [];

    for (let page = 1; page <= totalPages; page += 1) {
        items.push(
            <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
            >
                {page}
            </Pagination.Item>
        );
    }

    return (
        <div className="pagination-shell">
            <Pagination className="mb-0">
                <Pagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {items}
                <Pagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
}

export default PaginationBar;
