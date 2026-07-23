import { Pagination as BsPagination } from 'react-bootstrap'

/**
 * Pagination — điều hướng trang.
 * CHỈ hiển thị khi totalPages > 1.
 *
 * Props:
 *   currentPage   {number}    trang hiện tại (1-based)
 *   totalPages    {number}    tổng số trang
 *   onPageChange  {Function}  callback(pageNumber)
 *   totalRecords  {number}    tổng số bản ghi
 *   pageSize      {number}    số bản ghi mỗi trang (mặc định 5)
 */
function Pagination({ currentPage, totalPages, onPageChange, totalRecords, pageSize = 5 }) {
  // TODO: Nếu totalPages <= 1 → không render gì cả (return null)
  if (totalPages <= 1) return null

  // TODO: Tính toán recordFrom, recordTo để hiển thị "Show x of y records"
  const recordFrom = (currentPage - 1) * pageSize + 1
  const recordTo = Math.min(currentPage * pageSize, totalRecords)

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* TODO: Hiển thị "Show x of y records" */}
      <span className="text-muted small">
        Show {recordFrom}–{recordTo} of {totalRecords} records
      </span>

      <BsPagination className="mb-0">
        {/* TODO: Nút Previous — disabled khi đang ở trang 1 */}
        <BsPagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous"
        />

        {/* TODO: Render các số trang từ 1 đến totalPages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <BsPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BsPagination.Item>
        ))}

        {/* TODO: Nút Next — disabled khi đang ở trang cuối */}
        <BsPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </BsPagination>
    </div>
  )
}

export default Pagination
