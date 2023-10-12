import React, {useCallback, useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from the library
import * as Keychain from 'react-native-keychain';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import {AuthContext, AuthContextProps} from '../context/AuthContext';
import Spinner from '../components/Additional/Spinner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName = 'Dashboard'; // Default icon name
        if (route.name === 'Dashboard') {
          iconName = 'ios-home'; // Use the correct icon name for Ionicons
        } else {
          // Add more tab icons as needed
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    {/* Add more tab screens as needed */}
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const authContext = useContext(AuthContext) as AuthContextProps;
  const [status, setStatus] = useState('loading');
  const loadJWT = useCallback(async () => {
    try {
      const value = await Keychain.getGenericPassword();
      if (value === false) {
        throw new Error('No value stored in Keychain');
      }
      const jwt = JSON.parse(value.password);

      authContext.setAuthState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      // @ts-ignore
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (authContext?.authState?.authenticated === false) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    );
  }
};

export default AppNavigator;
