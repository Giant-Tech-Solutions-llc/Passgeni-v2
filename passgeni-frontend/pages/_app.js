import '../styles/globals.css';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * PassGeni — _app.js
 *
 * Fixes applied here:
 *  1. ErrorBoundary wraps every page → no more "Application error" white screen
 *  2. Global CSS imported (includes all style fixes)
 */
export default function App({ Component, pageProps }) {
  // Allow pages to define their own layout via getLayout
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ErrorBoundary>
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  );
}
