import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Error from './pages/error';

Sentry.init({
  dsn: 'https://66dff7f7d6091761061eceb520431155@o4510295240015872.ingest.de.sentry.io/4510295241719888',
  sendDefaultPii: true
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<Error code="500" title="Something went wrong" message="We encountered an unexpected error. Devy is looking into it!" />}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
