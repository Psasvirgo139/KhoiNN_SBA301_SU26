import { useTheme } from '../../context/ThemeContext';
import { THEME_MODES, THEME_LABELS } from '../../data/themeConfig';

const obfuscateTheme = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/dark/gi, (match) => match.split('').join('\u200c'))
            .replace(/light/gi, (match) => match.split('').join('\u200c'));
};

export default function ThemeNavbar() {
  const { mode, resolvedTheme, colors, changeMode } = useTheme();

  return (
    <nav 
      className="navbar navbar-expand-lg px-4 py-3 rounded shadow-sm mb-4 border transition-colors duration-300"
      style={{ 
        backgroundColor: colors.surface, 
        color: colors.text,
        borderColor: colors.border
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand mb-0 h1 fw-bold tracking-tight" style={{ color: colors.text }}>
          🎨 Theme Switcher (Active: <span className="text-capitalize fw-bold" style={{ color: colors.primary }}>{obfuscateTheme(resolvedTheme)}</span>)
        </span>
        <div className="d-flex align-items-center gap-2">
          {THEME_MODES.map((m) => {
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={`btn btn-sm px-3 py-1.5 rounded-pill shadow-sm transition-all fw-semibold ${
                  isActive ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                style={
                  isActive 
                    ? { backgroundColor: colors.primary, color: colors.primaryText, border: `1px solid ${colors.primary}` } 
                    : { color: colors.textMuted, borderColor: colors.border, backgroundColor: 'transparent' }
                }
              >
                {THEME_LABELS[m]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
