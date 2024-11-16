import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter } from '@vkontakte/vk-mini-apps-router';
import App, { routes } from '@socialpad/waatp';
import StandaloneApp from '@socialpad/standalone';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StandaloneApp router={createHashRouter(routes)}>
            <App />
        </StandaloneApp>
    </StrictMode>,
);
