import { Table, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

/**
 * RestaurantTable — hiển thị danh sách restaurants dạng bảng.
 *
 * Props:
 *   restaurants  {Array}     danh sách restaurant [{ id, name, category, owner, address, priceFrom, priceTo }]
 *   onDelete     {Function}  callback(restaurant) khi user click Delete
 */
function RestaurantTable({ restaurants = [], onDelete }) {
  const navigate = useNavigate()


  return (
    <>
      {restaurants.length === 0 ? (
        <p className="text-center text-muted my-4">No records found</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Restaurant Name</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Address</th>
              <th>Price range (đ)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r, index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.name}</td>
                <td>{r.category}</td>
                <td>{r.owner}</td>
                <td>{r.address}</td>
                <td>{r.priceFrom.toLocaleString()} – {r.priceTo.toLocaleString()}</td>
                <td>
                  <Button
                    variant="link"
                    className="text-danger p-0 me-2"
                    onClick={() => onDelete(r)}
                  >
                    Delete
                  </Button>
                  {' | '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate(`/restaurants/${r.id}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default RestaurantTable
