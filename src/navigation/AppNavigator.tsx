import React, {useCallback, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from the library
import * as Keychain from 'react-native-keychain';
import Spinner from '../components/Additional/Spinner';
import {useDispatch, useSelector} from 'react-redux';
import {setCredentials} from '../store/auth/authSlice';
import {RootState} from '../store';
import SettingsStack, {SettingsStackParamList} from './SettingsNavigator';
import {AuthStack, AuthStackParamList} from './AuthNavigator';
import DashboardStack, {DashboardStackParamList} from './DashboardNavigator';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Settings: undefined;
} & SettingsStackParamList &
  AuthStackParamList &
  DashboardStackParamList;

export const Stack = createStackNavigator<RootStackParamList>();
export const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator initialRouteName={'Dashboard'}>
    <Tab.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name={'Settings'}
      component={SettingsStack}
      options={{
        tabBarLabel: 'Settings',
        headerShown: false,
        tabBarIcon: ({color, size}) => (
          <Ionicons name="cog-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const bearerToken = useSelector((state: RootState) => state.auth.accessToken);
  const [status, setStatus] = useState('loading');

  const loadJWT = useCallback(async () => {
    try {
      if (bearerToken) {
        setStatus('success');
        return;
      }

      const value = await Keychain.getGenericPassword();
      if (value) {
        const jwt = JSON.parse(value.password);
        // Save the token from the Keychain to the Redux store
        dispatch(
          setCredentials({
            accessToken: jwt.accessToken,
            refreshToken: jwt.refreshToken,
          }),
        );

        setStatus('success');
      } else {
        setStatus('unauthenticated');
      }
    } catch (error) {
      // @ts-ignore
      console.log(`Keychain Error: ${error.message}`);
      setStatus('unauthenticated');
    }
  }, [bearerToken, dispatch]);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (status === 'unauthenticated' || !bearerToken) {
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
