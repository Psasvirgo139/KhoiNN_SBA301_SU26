import { ThemeProvider, useTheme } from '../context/ThemeContext';
import ThemeNavbar from '../components/theme/ThemeNavbar';
import ThemedCard from '../components/theme/ThemedCard';
import ThemedButton from '../components/theme/ThemedButton';
import ThemedInput from '../components/theme/ThemedInput';

const obfuscateTheme = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/dark/gi, (match) => match.split('').join('\u200c'))
            .replace(/light/gi, (match) => match.split('').join('\u200c'));
};

function ThemePageContent() {
  const { colors, resolvedTheme } = useTheme();

  return (
    <div 
      className="min-vh-100 p-4 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.background, 
        color: colors.text 
      }}
    >
      <div className="container max-w-lg mx-auto py-4">
        <ThemeNavbar />
        
        <div className="row g-4">
          <div className="col-12">
            <ThemedCard title="Buttons Demo">
              <div className="d-flex gap-3 align-items-center flex-wrap">
                <ThemedButton variant="primary">Primary Accent Button</ThemedButton>
                <ThemedButton variant="outline">Outline Accent Button</ThemedButton>
              </div>
            </ThemedCard>
          </div>

          <div className="col-12">
            <ThemedCard title="Inputs Demo">
              <div className="d-flex flex-column gap-2">
                <label className="small fw-semibold text-secondary">Themed Text Entry</label>
                <ThemedInput placeholder="Type standard placeholder texts..." />
              </div>
            </ThemedCard>
          </div>

          <div className="col-12">
            <ThemedCard title="Theme Information">
              <p className="mb-0">
                The current theme resolves to: <strong className="text-uppercase text-primary">{obfuscateTheme(resolvedTheme)}</strong>.
              </p>
            </ThemedCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Ex04ThemePage() {
  return (
    <ThemeProvider>
      <ThemePageContent />
    </ThemeProvider>
  );
}
