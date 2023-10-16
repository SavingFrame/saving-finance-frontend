// screens/Auth/LoginScreen.tsx
import React from 'react';
import {SafeAreaView} from 'react-native';
import LoginComponent from '../../components/Auth/LoginComponent';

const LoginScreen: React.FC = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000',
        width: '100%',
      }}>
      <LoginComponent />
    </SafeAreaView>
  );
};

export default LoginScreen;
