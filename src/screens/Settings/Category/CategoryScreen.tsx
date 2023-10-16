import React from 'react';
import CategoryManagementComponent from '../../../components/Settings/Category/CategoryManagementComponent';
import {StackNavigationProp} from '@react-navigation/stack';

type CategoryScreenProps = {
  navigation: StackNavigationProp<any>; // Define the type for the navigation prop
};
const CategoryScreen: React.FC<CategoryScreenProps> = ({navigation}) => {
  return <CategoryManagementComponent navigation={navigation} />;
};
export default CategoryScreen;
