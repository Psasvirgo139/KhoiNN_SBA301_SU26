import { useTheme } from '../../context/ThemeContext';

export default function ThemedInput({ placeholder }) {
  const { colors } = useTheme();

  return (
    <input 
      type="text"
      placeholder={placeholder} 
      className="form-control rounded-3 py-2 px-3 transition-colors duration-300"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text
      }}
    />
  );
}
