import React, {useCallback, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from the library
import * as Keychain from 'react-native-keychain';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import Spinner from '../components/Additional/Spinner';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import CategoryScreen from '../screens/Settings/Category/CategoryScreen';
import CategoryModalScreen from '../screens/Settings/Category/CategoryModalScreen';
import {useDispatch, useSelector} from 'react-redux';
import {setCredentials} from '../store/auth/authSlice';
import {RootState} from '../store';
import {Category} from '../services/Settings/Category/requests';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Settings: undefined;
  SettingsDetail: undefined;
  Categories: undefined;
  CategoryModal: {category?: Category; parent?: Category};
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Group>
      <Stack.Screen
        name="SettingsDetail"
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name={'Categories'}
        component={CategoryScreen}
        options={navigation => ({
          headerTitle: 'Categories',
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color={'#000'}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigation.navigate('CategoryModal');
              }}
            />
          ),
        })}
      />
    </Stack.Group>
    <Stack.Group screenOptions={{presentation: 'modal'}}>
      <Stack.Screen
        name={'CategoryModal'}
        component={CategoryModalScreen}
        initialParams={{category: undefined, parent: undefined}}
        options={{
          headerBackTitleVisible: false,
          headerRight: () => (
            <Ionicons
              name="checkmark-outline"
              size={30}
              color={'#000'}
              style={{marginRight: 10}}
            />
          ),
          headerBackImage: () => (
            <Ionicons
              name="close-outline"
              size={30}
              color={'#000'}
              style={{marginLeft: 10}}
            />
          ),
        }}
      />
    </Stack.Group>
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator initialRouteName={'Dashboard'}>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home" size={size} color={color} />
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
