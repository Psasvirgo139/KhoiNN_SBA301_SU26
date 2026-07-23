import { Table, Button, Badge, Image } from 'react-bootstrap';

export default function OrchidTable({ orchids, onEdit, onDelete }) {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '10%' }}>Image</th>
            <th style={{ width: '20%' }}>Name</th>
            <th style={{ width: '15%' }}>Category</th>
            <th style={{ width: '10%' }}>Natural</th>
            <th style={{ width: '10%' }}>Attractive</th>
            <th style={{ width: '20%' }}>Description</th>
            <th style={{ width: '10%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orchids.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-muted">
                Danh sách lan trống.
              </td>
            </tr>
          ) : (
            orchids.map((o, idx) => (
              <tr key={o.orchidId}>
                <td>{idx + 1}</td>
                <td>
                  {o.orchidURL ? (
                    <Image
                      src={o.orchidURL}
                      alt={o.orchidName}
                      thumbnail
                      style={{ maxHeight: '60px', maxWidth: '60px', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  ) : null}
                </td>
                <td className="fw-bold">{o.orchidName}</td>
                <td>{o.orchidCategory}</td>
                <td>
                  {o.isNatural ? (
                    <Badge bg="success">Natural</Badge>
                  ) : (
                    <Badge bg="secondary">Hybrid</Badge>
                  )}
                </td>
                <td>
                  {o.isAttractive ? (
                    <Badge bg="warning" text="dark">Attractive</Badge>
                  ) : (
                    <Badge bg="light" text="dark">Normal</Badge>
                  )}
                </td>
                <td className="text-truncate" style={{ maxWidth: '200px' }} title={o.orchidDescription}>
                  {o.orchidDescription}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(o.orchidId)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(o.orchidId)}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
