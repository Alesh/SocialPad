import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter } from '@vkontakte/vk-mini-apps-router';
import App, { routes } from '@socialpad/waatp';
import MiniApp from '@socialpad/miniapp';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MiniApp router={createHashRouter(routes)}>
            <App />
        </MiniApp>
    </StrictMode>,
);
