// screens/Dashboard/DashboardScreen.tsx
import React from 'react';
import {View} from 'react-native';
import DashboardComponent from '../../components/Dashboard/DashboardComponent';

const DashboardScreen: React.FC = () => {
  const username = 'User123'; // Fetch the username from your authentication state or context

  return (
    <View style={{flex: 1}}>
      <DashboardComponent username={username} />
    </View>
  );
};

export default DashboardScreen;
