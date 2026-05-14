
function MyProfile({ student }) {

    if (!student) {
      return <p>Đang tải dữ liệu sinh viên...</p>;
    }
  
    const { id, name, avatar } = student;
  
    return (
      <div style={styles.card}>
        <h1>My Profile</h1>
        <img 
          src={avatar || "https://via.placeholder.com/150"} 
          alt={name} 
          style={styles.avatar} 
        />
        <div style={styles.info}>
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Name:</strong> {name}</p>
          <p>This is {name}'s profile page.</p>
        </div>
      </div>
    );
  }
  
  const styles = {
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', width: '300px', textAlign: 'center' },
    avatar: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' },
    info: { marginTop: '15px', textAlign: 'left' }
  };
  
  export default MyProfile;