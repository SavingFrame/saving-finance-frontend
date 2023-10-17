import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Category,
  useGetCategoriesQuery,
} from '../../../services/Settings/categories';

type ParentCategoryPickerProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
};

const ParentCategoryPicker: React.FC<ParentCategoryPickerProps> = ({
  isVisible,
  onClose,
  onSelect,
}) => {
  const {data} = useGetCategoriesQuery();
  const parentCategories = data?.filter(category => !category.parent) || [];
  const displayedCategories = [
    {
      id: 0,
      name: 'No',
      icon: 'remove',
      color: '#fff',
      parent: null,
    } as unknown as Category,
    ...parentCategories,
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <SafeAreaView style={pickerStyles.container}>
        <View style={pickerStyles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={pickerStyles.title}>Select Parent Category</Text>
        </View>
        <FlatList
          data={displayedCategories}
          renderItem={({item}) => (
            <TouchableOpacity
              style={pickerStyles.categoryItem}
              onPress={() => onSelect(item)}>
              <Ionicons
                name={item.icon}
                size={24}
                color={item.color}
                style={pickerStyles.categoryIcon}
              />
              <Text style={pickerStyles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={category => String(category.id)}
        />
      </SafeAreaView>
    </Modal>
  );
};

const pickerStyles = StyleSheet.create({
  container: {
    flex: 0.8, // covers 80% of the screen
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: '#333',
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#333', // You can adjust this color as needed
  },
  categoryName: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10, // Provides some spacing between the icon and the text
  },
  categoryIcon: {
    width: 24, // You can adjust this as necessary
    height: 24, // You can adjust this as necessary
  },
});

export default ParentCategoryPicker;
