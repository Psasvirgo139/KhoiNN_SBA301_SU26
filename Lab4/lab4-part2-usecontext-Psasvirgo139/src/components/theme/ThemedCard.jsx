import { useTheme } from '../../context/ThemeContext';

export default function ThemedCard({ title, children }) {
  const { colors } = useTheme();

  return (
    <div 
      className="card shadow-sm mb-4 border transition-colors duration-300"
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        color: colors.text
      }}
    >
      {title && (
        <div 
          className="card-header border-bottom fw-bold"
          style={{ 
            borderColor: colors.border,
            color: colors.text 
          }}
        >
          {title}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
