// components/Dashboard/DashboardComponent.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface DashboardComponentProps {
  username: string;
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({username}) => {
  return (
    <View style={styles.container}>
      <Text>Welcome, {username}!</Text>
      {/* Add more dashboard components as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default DashboardComponent;
