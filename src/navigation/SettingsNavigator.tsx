import React from 'react';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import CategoryScreen from '../screens/Settings/Category/CategoryScreen';
import CategoryModalScreen from '../screens/Settings/Category/CategoryModalScreen';

import {Stack} from './AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Category, Subcategory} from '../services/Settings/Category/requests'; // Import Ionicons from the library

export type SettingsStackParamList = {
  SettingsDetail: undefined;
  Categories: undefined;
  CategoryModal: {category?: Category | Subcategory; parent?: Category};
};

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
        options={({navigation}) => ({
          headerTitle: 'Categories',
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color={'#000'}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('CategoryModal');
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
          headerTitle: 'Add Category',
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

export default SettingsStack;
