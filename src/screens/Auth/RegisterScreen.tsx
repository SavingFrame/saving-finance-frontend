// screens/Auth/RegisterScreen.tsx
import React from 'react';
import {View} from 'react-native';
import RegisterComponent from '../../components/Auth/RegisterComponent';

const RegisterScreen: React.FC = () => {
  const handleRegister = (username: string, password: string) => {
    // Implement your registration logic here
    console.log('Registration attempt with:', username, password);
    // Navigate to the login screen or handle registration success
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <RegisterComponent onRegister={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
