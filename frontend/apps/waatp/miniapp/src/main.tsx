import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@socialpad/waatp';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
