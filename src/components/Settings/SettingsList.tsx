import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux'; // added useDispatch import
import {logout} from '../../store/auth/authSlice';

const navigateTo = (navigation: StackNavigationProp<any>, screen: string) => {
  navigation.navigate(screen);
};

const SettingsList: React.FC<SettingsListProps> = ({navigation}) => {
  const dispatch = useDispatch(); // Get the dispatch function

  const settingsData = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person-outline',
      onClick: () => navigateTo(navigation, 'Profile'),
    },
    {
      id: 'generalCurrency',
      title: 'General Currency',
      icon: 'cash-outline',
      onClick: () => navigateTo(navigation, 'GeneralCurrency'),
    },
    {
      id: 'categories',
      title: 'Categories',
      icon: 'list-outline',
      onClick: () => navigateTo(navigation, 'Categories'),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out-outline',
      onClick: () => dispatch(logout()), // Uses the dispatch function directly
    },
  ];
  const renderSettingItem = ({
    item,
  }: {
    item: {id: string; title: string; icon: string; onClick: Function};
  }) => {
    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => {
          if (item.id !== 'logout') {
            item.onClick(navigation);
          } else {
            item.onClick();
          }
        }}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.icon}
            size={20}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.settingText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={settingsData}
      renderItem={renderSettingItem}
      keyExtractor={item => item.id}
    />
  );
};

type SettingsListProps = {
  navigation: StackNavigationProp<any>; // Define the type for the navigation prop
};

const styles = StyleSheet.create({
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SettingsList;
