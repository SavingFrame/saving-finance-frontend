import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useGetCategoriesQuery} from '../../../services/Settings/Category/requests';
import {RootStackParamList} from '../../../navigation/AppNavigator';
import {StackScreenProps} from '@react-navigation/stack/lib/typescript/src/types';

type Props = StackScreenProps<RootStackParamList, 'Categories'>;

const CategoryScreen = ({navigation}: Props) => {
  const {data, error, isLoading} = useGetCategoriesQuery();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );

  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999999" />
        <Text style={styles.loadingText}>Loading Categories...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Oops! Something went wrong.</Text>
        <TouchableOpacity onPress={() => console.log('123')}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Categories</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.categoryHeader}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryModal', {category: item})
                }>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
              {item.subcategories && item.subcategories.length > 0 && (
                <Ionicons
                  name={
                    expandedCategories.has(item.id)
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color="#fff"
                  onPress={() => toggleExpand(item.id)}
                  style={{marginLeft: 10}}
                />
              )}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryModal', {parent: item})
                }
                style={styles.addSubCategoryButton}>
                <Ionicons name="add-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            {expandedCategories.has(item.id) && (
              <FlatList
                data={item.subcategories}
                renderItem={({item: subcategory}) => (
                  <View style={styles.subcategoryContainer}>
                    <Ionicons
                      name={subcategory.icon}
                      size={20}
                      color={subcategory.color}
                    />
                    <Text style={styles.subcategoryName}>
                      {subcategory.name}
                    </Text>
                  </View>
                )}
                keyExtractor={subcategory => String(subcategory.id)}
              />
            )}
          </View>
        )}
        keyExtractor={category => String(category.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  subcategoryContainer: {
    marginLeft: 30,
    marginTop: 5, // <- Decreased to bring the border down
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8E8E93',
    paddingBottom: 10, // <- Increased to push the border more centered
  },
  subcategoryName: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 10,
  },
  addSubCategoryButton: {
    marginLeft: 'auto', // push the button to the far right of the container
    paddingLeft: 15, // some spacing from the category name
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    color: '#007AFF', // change this to your preferred button color
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF', // change this to your preferred button border color
    borderRadius: 8,
    textAlign: 'center',
  },
});

export default CategoryScreen;
