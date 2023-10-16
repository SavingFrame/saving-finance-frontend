import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {isAxiosError} from 'axios';
import publicAxios from '../../services/api/publicAxios';
import {setCredentials} from '../../store/auth/authSlice';
import {useDispatch} from 'react-redux';

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const onLogin = async () => {
    try {
      const response = await publicAxios.post('/v1/token/', {
        email,
        password,
      });

      const {access, refresh} = response.data;
      dispatch(setCredentials({accessToken: access, refreshToken: refresh}));
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        Alert.alert(
          'Login Failed',
          error.response?.data.detail || error.response?.data,
        );
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
