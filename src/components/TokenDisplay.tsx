import React from 'react';
import { useOktaAuth } from '@okta/okta-react';

const TokenDisplay: React.FC = () => {
  const { authState } = useOktaAuth();

  if (!authState?.isAuthenticated) {
    return <div>Please log in to view tokens</div>;
  }

  const idToken = authState.idToken;
  const accessToken = authState.accessToken;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Token Information</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>ID Token</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px'
        }}>
          {JSON.stringify(idToken, null, 2)}
        </pre>
      </div>

      <div>
        <h3>Access Token</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px'
        }}>
          {JSON.stringify(accessToken, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TokenDisplay; 