import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import { GameProvider } from './context/GameContext';
import { AuthProvider } from './context/AuthContext';
import { UIActionsProvider } from './context/UIActionsContext';
import { PwaProvider } from './context/PwaContext';
import { ToastProvider } from './context/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <UIActionsProvider>
            <PwaProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </PwaProvider>
          </UIActionsProvider>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
