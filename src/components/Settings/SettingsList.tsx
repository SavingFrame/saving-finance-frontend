import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackNavigationProp} from '@react-navigation/stack';

const settingsData = [
  {
    id: 'profile',
    title: 'Profile',
    icon: 'person-outline',
    navigateTo: 'Profile',
  },
  {
    id: 'generalCurrency',
    title: 'General Currency',
    icon: 'cash-outline',
    navigateTo: 'GeneralCurrency',
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: 'list-outline',
    navigateTo: 'Categories',
  },
];

type SettingsListProps = {
  navigation: StackNavigationProp<any>; // Define the type for the navigation prop
};

const SettingsList: React.FC<SettingsListProps> = ({navigation}) => {
  const renderSettingItem = ({
    item,
  }: {
    item: {id: string; title: string; icon: string; navigateTo: string};
  }) => {
    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate(item.navigateTo)}>
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
