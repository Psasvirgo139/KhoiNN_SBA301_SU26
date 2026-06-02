import { useTheme } from '../../context/ThemeContext';

export default function ThemedButton({ children, onClick, variant = 'primary' }) {
  const { colors } = useTheme();

  let btnStyle = {
    transition: 'all 0.3s ease',
  };

  if (variant === 'primary') {
    btnStyle.backgroundColor = colors.primary;
    btnStyle.color = colors.primaryText;
    btnStyle.border = `1px solid ${colors.primary}`;
  } else if (variant === 'outline') {
    btnStyle.backgroundColor = 'transparent';
    btnStyle.color = colors.primary;
    btnStyle.border = `1px solid ${colors.primary}`;
  }

  return (
    <button 
      onClick={onClick} 
      className="btn shadow-sm fw-semibold rounded-3 px-4 py-2 transition"
      style={btnStyle}
    >
      {children}
    </button>
  );
}
