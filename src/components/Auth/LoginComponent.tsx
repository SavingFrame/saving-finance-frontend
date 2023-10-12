import React, {useContext, useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Text} from 'react-native';
import {AxiosContext, AxiosContextProps} from '../../context/AxiosContext';
import {AuthContext, AuthContextProps} from '../../context/AuthContext';
import * as Keychain from 'react-native-keychain';
import {isAxiosError} from 'axios';

interface LoginComponentProps {
  onLogin: (username: string, password: string) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext) as AuthContextProps;
  const {publicAxios} = useContext(AxiosContext) as AxiosContextProps;

  const onLogin = async () => {
    try {
      const response = await publicAxios.post('/login', {
        email,
        password,
      });

      const {accessToken, refreshToken} = response.data;
      authContext.setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });

      await Keychain.setGenericPassword(
        'token',
        JSON.stringify({
          accessToken,
          refreshToken,
        }),
      );
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert('Login Failed', error.response?.data.message);
      } else {
        Alert.alert('Login Failed with unknown error');
      }
    }
  };

  return (
    <>
      <Text style={styles.logo}>Authorization</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fefefe"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
          value={password}
          placeholderTextColor="#fefefe"
        />
      </View>
      <Button title="Login" onPress={() => onLogin()} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  logo: {
    fontSize: 60,
    color: '#fff',
    margin: '20%',
  },
  form: {
    width: '80%',
    margin: '10%',
  },
  input: {
    fontSize: 20,
    color: '#fff',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  button: {},
});

export default LoginComponent;
