import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import WalletScreen from '../screens/Dashboard/WalletScreen';
import WalletModalScreen from '../screens/Dashboard/WalletModalScreen';
import {Stack} from './AppNavigator';
import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from the library
import {Wallet} from '../services/Dashboard/wallets';

export type DashboardStackParamList = {
  DashboardPage: undefined;
  Wallet: undefined;
  WalletModalScreen: {wallet?: Wallet};
};

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Group>
      <Stack.Screen
        name="DashboardPage"
        component={DashboardScreen}
        options={({navigation}) => ({
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}
              onPress={() => navigation.navigate('Wallet')} // Add this line for navigation
            >
              <Ionicons
                name={'home-outline'}
                size={30}
                color="#000"
                style={{marginRight: 10}}
              />
              <Text>All Accounts</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Text style={{marginRight: 20}}>PRO</Text>
              <Button title="🔍" onPress={() => {}} />
              <Button title="⋮" onPress={() => {}} />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={({navigation}) => ({
          headerBackImage: () => (
            <Ionicons
              name="close-outline"
              size={30}
              color={'#000'}
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color={'#000'}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('WalletModalScreen');
              }}
            />
          ),
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Group>
    <Stack.Group screenOptions={{presentation: 'modal'}}>
      <Stack.Screen
        name="WalletModalScreen"
        component={WalletModalScreen}
        initialParams={{wallet: undefined}}
        options={{
          headerTitle: 'Add Account',
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

export default DashboardStack;
