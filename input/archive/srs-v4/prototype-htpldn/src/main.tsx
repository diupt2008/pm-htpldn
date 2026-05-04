import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeConfigProvider } from '@/theme/ThemeConfigProvider';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeConfigProvider>
        <App />
      </ThemeConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
