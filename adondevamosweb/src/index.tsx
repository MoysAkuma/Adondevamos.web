import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.js';

const container = document.getElementById('root');

if (!container) throw new Error('Root container not found');

const root = createRoot(container); // No need for "!" with the check above

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);