import { AuthProvider } from '@/contexts/AuthContext';
// ... other imports

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Your existing app structure */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;