export const blogPosts = [
  {
    id: 1, title: 'Giới Thiệu React Hooks', category: 'React',
    date: '2024-01-15', author: 'Nguyễn Dev',
    excerpt: 'React Hooks thay đổi cách chúng ta viết component trong React.',
    content: 'React Hooks được giới thiệu trong React 16.8, cho phép sử dụng state và các tính năng React khác trong function component. Các hook phổ biến bao gồm useState, useEffect, useContext...',
    image: '/images/blog/react-hooks.jpg',
  },
  {
    id: 2, title: 'Hiểu Sâu Về useState', category: 'React',
    date: '2024-01-20', author: 'Trần Code',
    excerpt: 'useState là hook cơ bản nhất và quan trọng nhất trong React.',
    content: 'useState cho phép thêm state vào function component. Khi state thay đổi, React sẽ re-render component. Hook này nhận giá trị khởi tạo và trả về array gồm state hiện tại và hàm setter...',
    image: '/images/blog/usestate.jpg',
  },
  {
    id: 3, title: 'React Router DOM v6', category: 'Routing',
    date: '2024-02-01', author: 'Lê Router',
    excerpt: 'React Router v6 mang đến nhiều thay đổi và cải tiến đáng kể.',
    content: 'React Router v6 thay đổi cách định nghĩa route với cú pháp mới, nested routes, và các hook mạnh mẽ hơn như useNavigate, useParams, useSearchParams...',
    image: '/images/blog/router.jpg',
  },
  {
    id: 4, title: 'Bootstrap vs Tailwind CSS', category: 'CSS',
    date: '2024-02-10', author: 'Phạm Style',
    excerpt: 'So sánh hai framework CSS phổ biến nhất hiện nay.',
    content: 'Bootstrap cung cấp các component sẵn có với thiết kế nhất quán. Tailwind CSS là utility-first framework cho phép tùy chỉnh cao. Mỗi framework có ưu và nhược điểm riêng...',
    image: '/images/blog/css.jpg',
  },
  {
    id: 5, title: 'Gọi REST API Với Fetch', category: 'API',
    date: '2024-02-15', author: 'Nguyễn API',
    excerpt: 'Cách tích hợp REST API vào ứng dụng React một cách hiệu quả.',
    content: 'Fetch API là cách hiện đại để gọi HTTP requests trong JavaScript. Kết hợp với useEffect trong React, chúng ta có thể tải dữ liệu từ server khi component được mount...',
    image: '/images/blog/api.jpg',
  },
  {
    id: 6, title: 'useEffect Và Side Effects', category: 'React',
    date: '2024-02-20', author: 'Trần Effect',
    excerpt: 'useEffect dùng để xử lý side effects trong React component.',
    content: 'useEffect chạy sau mỗi render và cho phép thực hiện side effects như: gọi API, thao tác DOM, đăng ký event listener. Dependency array kiểm soát khi nào effect chạy lại...',
    image: '/images/blog/useeffect.jpg',
  },
  {
    id: 7, title: 'CSS Grid Layout', category: 'CSS',
    date: '2024-03-01', author: 'Lê Grid',
    excerpt: 'CSS Grid giúp tạo layout phức tạp một cách đơn giản và linh hoạt.',
    content: 'CSS Grid là hệ thống layout 2 chiều mạnh mẽ. Với Grid, chúng ta có thể tạo layout phức tạp mà không cần float hay positioning. Grid container và grid items là hai khái niệm cốt lõi...',
    image: '/images/blog/grid.jpg',
  },
  {
    id: 8, title: 'Tối Ưu Hiệu Năng React', category: 'Performance',
    date: '2024-03-10', author: 'Phạm Perf',
    excerpt: 'Các kỹ thuật tối ưu để React app chạy nhanh hơn.',
    content: 'Tối ưu React app bao gồm: sử dụng React.memo, useMemo, useCallback để tránh re-render không cần thiết. Code splitting với React.lazy và Suspense để tải component theo yêu cầu...',
    image: '/images/blog/performance.jpg',
  },
];

export const blogCategories = ['Tất cả', 'React', 'Routing', 'CSS', 'API', 'Performance'];
