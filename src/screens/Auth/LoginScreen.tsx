// screens/Auth/LoginScreen.tsx
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import publicAxios from '../../services/api/publicAxios';
import {setCredentials} from '../../store/auth/authSlice';
import {useDispatch} from 'react-redux/es/exports';
import {isAxiosError} from 'axios';

const LoginScreen: React.FC = () => {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    fontSize: 60,
    color: '#fff',
    marginBottom: 40,
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    fontSize: 20,
    color: '#fff',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginVertical: 20,
    width: '100%',
  },
});

export default LoginScreen;
