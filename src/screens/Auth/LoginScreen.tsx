// screens/Auth/LoginScreen.tsx
import React from 'react';
import {SafeAreaView} from 'react-native';
import LoginComponent from '../../components/Auth/LoginComponent';

const LoginScreen: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    // Implement your login logic here
    console.log('Login attempt with:', username, password);
    // Navigate to the dashboard or handle login success
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000',
        width: '100%',
      }}>
      <LoginComponent onLogin={handleLogin} />
    </SafeAreaView>
  );
};

export default LoginScreen;
