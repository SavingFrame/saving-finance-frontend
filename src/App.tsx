import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import {AxiosProvider} from './context/AxiosContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AxiosProvider>
        <AppNavigator />
      </AxiosProvider>
    </AuthProvider>
  );
};

export default App;
