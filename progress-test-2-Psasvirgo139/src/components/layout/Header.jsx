/**
 * Header — thanh tiêu đề chung toàn app.
 * Layout: [Logo] [Restaurant Management]  [Date: yyyy-MM-dd]
 */
function Header() {
  // TODO: Lấy ngày hiện tại, format theo yyyy-MM-dd
  const today = new Date().toISOString().split('T')[0] // TODO: new Date().toISOString().split('T')[0]

  return (
    <header className="bg-primary text-white py-2 px-4 d-flex justify-content-between align-items-center">
      {/* TODO: Hiển thị Logo bên trái */}
      <div className="fw-bold fs-5">
        {/* TODO: Logo placeholder */} 🍽️ Restaurant Management
      </div>
      {/* TODO: Hiển thị ngày hiện tại bên phải dạng "Date: yyyy-MM-dd" */}
      <div className="small">Date: {today}</div>
    </header>
  )
}

export default Header
