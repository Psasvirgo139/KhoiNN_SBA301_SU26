import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Alert } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import RestaurantFilter from '../components/restaurant/RestaurantFilter'
import RestaurantTable from '../components/restaurant/RestaurantTable'
import DeleteModal from '../components/restaurant/DeleteModal'
import Pagination from '../components/restaurant/Pagination'
import { getRestaurants, deleteRestaurant } from '../services/restaurantService'
import { getCategories } from '../services/categoryService'
import { MESSAGES } from '../constants/messages'

const PAGE_SIZE = 5

/**
 * RestaurantListPage — Screen 1: Danh sách restaurant.
 *
 * Chức năng:
 *  1. Tải danh sách restaurants và categories từ API khi mount
 *  2. Lọc theo name (contains, case-insensitive) và category (exact match)
 *  3. Sắp xếp kết quả theo name ascending
 *  4. Phân trang — chỉ hiển thị khi >1 trang
 *  5. Xóa restaurant qua DeleteModal → refresh danh sách
 *  6. Hiển thị MS05 khi API lỗi, MS08 sau khi xóa thành công
 */
function RestaurantListPage() {
  const navigate = useNavigate()

  // --- State ---
  const [restaurants, setRestaurants] = useState([])
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // State cho DeleteModal
  const [showModal, setShowModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  // --- Load dữ liệu ban đầu ---
  useEffect(() => {
    // TODO: Gọi loadData() khi component mount
    loadData()
  }, [])

  async function loadData() {
    // TODO: Gọi getRestaurants() và getCategories() song song (Promise.all)
    // TODO: Sắp xếp restaurants theo name ascending
    // TODO: setRestaurants và setFiltered với kết quả
    // TODO: setCategories với kết quả
    // TODO: Nếu lỗi → setErrorMsg(MESSAGES.MS05)
    try {
      const [restRes, catRes] = await Promise.all([getRestaurants(), getCategories()])
      const sorted = [...restRes].sort((a, b) => a.name.localeCompare(b.name))
      setRestaurants(sorted)
      setFiltered(sorted)
      setCategories(catRes)
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  // --- Xử lý Filter ---
  function handleFilter({ name, category }) {
    // TODO: Lọc restaurants theo name (contains, case-insensitive) và category (exact)
    // TODO: Sắp xếp kết quả theo name ascending
    // TODO: setFiltered(result)
    // TODO: Reset về trang 1: setCurrentPage(1)
    let result = [...restaurants]
    if (name) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(name.toLowerCase())
      )
    }
    if (category) {
      result = result.filter((r) => r.category === category)
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    setFiltered(result)
    setCurrentPage(1)
  }

  // --- Xử lý Delete ---
  function handleDeleteClick(restaurant) {
    // TODO: setSelectedRestaurant(restaurant)
    // TODO: setShowModal(true)
    setSelectedRestaurant(restaurant)
    setShowModal(true)
  }

  async function handleDeleteConfirm() {
    // TODO: setShowModal(false)
    // TODO: Gọi deleteRestaurant(selectedRestaurant.id)
    // TODO: setSuccessMsg(MESSAGES.MS08)
    // TODO: Gọi loadData() để refresh danh sách
    // TODO: Nếu lỗi → setErrorMsg(MESSAGES.MS05)
    setShowModal(false)
    try {
      await deleteRestaurant(selectedRestaurant.id)
      setSuccessMsg(MESSAGES.MS08)
      await loadData()
    } catch (err) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  // --- Phân trang ---
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <>
      <Header />
      <Container className="my-4">
        <h4>Restaurant List</h4>

        {/* TODO: Hiển thị successMsg (màu success) khi có, tự ẩn sau vài giây hoặc khi user thao tác */}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        {/* TODO: Hiển thị errorMsg (màu danger) khi có */}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {/* TODO: Nút Add New → navigate('/restaurants/add') */}
        <div className="d-flex justify-content-end mb-3">
          <Button variant="success" onClick={() => navigate('/restaurants/add')}>
            Add New
          </Button>
        </div>

        {/* TODO: RestaurantFilter — truyền categories và onFilter={handleFilter} */}
        <RestaurantFilter categories={categories} onFilter={handleFilter} />

        {/* TODO: RestaurantTable — truyền danh sách paginated và onDelete={handleDeleteClick} */}
        <RestaurantTable restaurants={paginated} onDelete={handleDeleteClick} />

        {/* TODO: Pagination — truyền currentPage, totalPages, onPageChange, totalRecords, pageSize */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filtered.length}
          pageSize={PAGE_SIZE}
        />

        {/* TODO: DeleteModal — truyền show, restaurant, onConfirm, onClose */}
        <DeleteModal
          show={showModal}
          restaurant={selectedRestaurant}
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowModal(false)}
        />
      </Container>
      <Footer />
    </>
  )
}

export default RestaurantListPage
