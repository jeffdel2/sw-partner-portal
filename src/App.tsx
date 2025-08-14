import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import { Security, LoginCallback, useOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { oktaConfig } from './config';
import TokenDisplay from './components/TokenDisplay';

const oktaAuth = new OktaAuth(oktaConfig);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useOktaAuth();

  if (!authState?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const LoginButton = () => {
  const { oktaAuth } = useOktaAuth();

  const handleLogin = async () => {
    try {
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <button onClick={handleLogin} style={{ 
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
      Login
    </button>
  );
};

const LogoutButton = () => {
  const { oktaAuth } = useOktaAuth();

  const handleLogout = async () => {
    try {
      await oktaAuth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button onClick={handleLogout} style={{ 
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px'
    }}>
      Logout
    </button>
  );
};



const HomePage = () => {
  const { authState } = useOktaAuth();
  const realmName = authState?.idToken?.claims?.realmName;
  const isAdminUser = authState?.idToken?.claims?.realmName === true;
  const isAdmin = (realmName === 'NAPA_REALM' || realmName === 'EAST_REALM' || realmName === 'WEST_REALM') && realmName;
  
  // Map each realm to its specific admin URL
  const getAdminUrl = (realm: any) => {
    switch (realm) {
      case 'NAPA_REALM':
        return 'https://sherwindemo.twisec.com/partner-portal/guop53oy4bTNZpcNO1d7';
      case 'EAST_REALM':
        return 'https://sherwindemo.twisec.com/partner-portal/guop53mic7JNWXMmO1d7';
      case 'WEST_REALM':
        return 'https://sherwindemo.twisec.com/partner-portal/guop53y5n89mtrusM1d7'; // You can update this URL as needed
      default:
        return 'https://sherwindemo.twisec.com/partner-portal/guop53y5n89mtrusM1d7'; // Default fallback
    }
  };
  
  const adminUrl = getAdminUrl(realmName);

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            backgroundColor: '#003366',
            padding: '8px 12px',
            borderRadius: '4px',
            marginRight: '15px'
          }}>
            <img 
              src="https://s7d2.scene7.com/is/image/sherwinwilliams/branding_2x?scl=1&fmt=png-alpha" 
              alt="USAA Logo" 
              style={{ 
                height: '30px',
                display: 'block'
              }} 
            />
          </div>
          <h1 style={{ 
            color: '#003366',
            margin: '0',
            fontSize: '24px'
          }}>Partner Portal</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!authState?.isAuthenticated ? (
            <LoginButton />
          ) : (
            <>
              <Link to="/protected" style={{ 
                marginRight: '10px',
                color: '#003366',
                textDecoration: 'none'
              }}>Protected Page</Link>
              {isAdmin && (
                <a 
                  href={adminUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    marginRight: '10px',
                    color: '#003366',
                    textDecoration: 'none'
                  }}
                >
                  Admin
                </a>
              )}
              <LogoutButton />
            </>
          )}
        </div>
      </header>

      <main>
        <section style={{ 
          background: '#f5f9ff',
          padding: '40px',
          borderRadius: '8px',
          marginBottom: '40px'
        }}>
          <h2 style={{ 
            color: '#003366',
            marginBottom: '20px'
          }}>
            Welcome to the Sherwin Williams Partner Portal
            {authState?.isAuthenticated && authState?.idToken?.claims?.name && (
              <span style={{ 
                color: '#003366',
                fontSize: '0.9em',
                display: 'block',
                marginTop: '10px',
                fontWeight: 'normal'
              }}>
                Hello, {authState.idToken.claims.name}!
              </span>
            )}
          </h2>
          <p style={{ 
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#333',
            marginBottom: '30px'
          }}>
            Streamline your product verification process with our secure partner portal. 
            Access real-time product information, verify availability, and manage customer data efficiently.
          </p>
        </section>

        {isAdmin && (
          <div style={{ 
            background: '#f5f9ff',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '40px',
            border: '2px solid #003366',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: '#003366',
              marginBottom: '15px',
              fontSize: '24px'
            }}>⚙️ Admin Dashboard</h3>
            <p style={{ 
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333',
              marginBottom: '25px'
            }}>
              Welcome to the admin dashboard. Manage users, configure settings, and monitor system activity.
            </p>
            <a 
              href={adminUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#003366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease'
              }}
            >
              Access Admin Portal
            </a>
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#003366', marginBottom: '15px' }}>Real-time Information</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Instantly verify product availability and product details for your customers.
            </p>
          </div>
          <div style={{ 
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#003366', marginBottom: '15px' }}>Secure Access</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Enterprise-grade security to protect sensitive customer information.
            </p>
          </div>
          <div style={{ 
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#003366', marginBottom: '15px' }}>24/7 Availability</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Access the portal anytime, anywhere to meet your business needs.
            </p>
          </div>
        </div>

        {!authState?.isAuthenticated && (
          <div style={{ 
            textAlign: 'center',
            padding: '40px',
            background: '#f5f9ff',
            borderRadius: '8px'
          }}>
            <h3 style={{ 
              color: '#003366',
              marginBottom: '20px'
            }}>Ready to Get Started?</h3>
            <p style={{ 
              marginBottom: '30px',
              color: '#666'
            }}>
              Log in to access the partner portal and start verifying product availability.
            </p>
            <LoginButton />
          </div>
        )}
        

      </main>

      <footer style={{ 
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>© 2024 USAA. All rights reserved.</p>
        <p style={{ marginTop: '10px' }}>
          For support, please contact: <a href="mailto:support@usaa.com" style={{ color: '#003366' }}>support@usaa.com</a>
        </p>
      </footer>
    </div>
  );
};

const CustomLoginCallback = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState?.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [authState, navigate]);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await oktaAuth.handleLoginRedirect();
      } catch (err) {
        // Ignore the specific token parsing error if the user is authenticated
        if (authState?.isAuthenticated) {
          return;
        }
        
        // Only show other errors
        if (err instanceof Error && !err.message.includes('Unable to parse a token from the url')) {
          console.error('Authentication error:', err);
          setError('Failed to complete authentication. Please try again.');
        }
      }
    };

    handleAuth();
  }, [oktaAuth, authState]);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error during login</h2>
        <p>{error}</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processing login...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  
  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    navigate(originalUri);
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/login/callback" element={<CustomLoginCallback />} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <TokenDisplay />
            </ProtectedRoute>
          } />

          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Security>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
