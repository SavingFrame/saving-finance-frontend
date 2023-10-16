import React from 'react';
import {View} from 'react-native';
import SettingsList from '../../components/Settings/SettingsList';
import {StackNavigationProp} from '@react-navigation/stack';

type SettingsScreenProps = {
  navigation: StackNavigationProp<any>; // Define the type for the navigation prop
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, padding: 16}}>
      <SettingsList navigation={navigation} />
    </View>
  );
};
export default SettingsScreen;
