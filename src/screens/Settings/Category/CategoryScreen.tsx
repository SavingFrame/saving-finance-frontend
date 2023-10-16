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
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('CategoryModal', {category: item})
            }>
            <View style={styles.categoryHeader}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={styles.categoryName}>{item.name}</Text>
              {item.subcategories && item.subcategories.length > 0 && (
                <Ionicons
                  name={
                    expandedCategories.has(item.id)
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color="#000"
                  onPress={() => toggleExpand(item.id)}
                  style={{marginLeft: 10}}
                />
              )}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryModal', {parent: item})
                }
                style={styles.addSubCategoryButton}>
                <Ionicons name="add-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            {expandedCategories.has(item.id) && (
              <FlatList
                data={item.subcategories}
                renderItem={({item: subcategory, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.subcategoryContainer,
                      index === 0 && styles.firstSubcategory,
                      index === item.subcategories.length - 1 &&
                        styles.lastSubcategory,
                    ]}
                    onPress={() =>
                      navigation.navigate('CategoryModal', {
                        category: subcategory,
                        parent: item,
                      })
                    }>
                    <Ionicons
                      name={subcategory.icon}
                      size={20}
                      color={subcategory.color}
                    />
                    <Text style={styles.subcategoryName}>
                      {subcategory.name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={subcategory => String(subcategory.id)}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={category => String(category.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 17,
    color: '#000',
    marginLeft: 8,
  },
  subcategoryName: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  addSubCategoryButton: {
    marginLeft: 'auto',
    paddingLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#000',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    color: '#007AFF',
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    textAlign: 'center',
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  subcategoryContainer: {
    marginLeft: 20,
    marginTop: 3,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  firstSubcategory: {
    paddingTop: 8,
  },
  lastSubcategory: {
    paddingBottom: 6,
    marginBottom: 5,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginLeft: 20,
  },
});

export default CategoryScreen;
