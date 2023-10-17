import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HueColorPicker from '../../../components/Additional/ColorPicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconChooserModal from '../../../components/Settings/Category/IconChooserModal';
import {
  Category,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../../../services/Settings/Category/requests';
import ParentCategoryPicker from '../../../components/Settings/Category/ParentCategoryPicker';
import type {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'CategoryModal'>;

const CategoryModalScreen = ({route, navigation}: Props) => {
  const {category, parent} = route.params;
  const [title, setTitle] = useState(category?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(
    category?.icon || 'fast-food-outline',
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [color, setColor] = useState(category?.color || '#808080');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<Category | null>(parent || null);
  const [showParentCategoryPicker, setShowParentCategoryPicker] =
    useState(false);

  React.useEffect(() => {
    if (category) {
      navigation.setOptions({
        headerTitle: 'Edit Category',
      });
    }
  }, [category, navigation]);

  const handleSelectParentCategory = (ct: Category) => {
    setSelectedParentCategory(ct);
    setShowParentCategoryPicker(false);
  };

  const handleDelete = async () => {
    if (category) {
      await deleteCategory(category.id);
      navigation.goBack();
    }
  };

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  React.useEffect(() => {
    const handleSubmit = async () => {
      const data = {
        name: title,
        icon: selectedIcon,
        color,
        parent: selectedParentCategory?.id || null,
      };
      if (category) {
        await updateCategory({id: category.id, ...data});
      } else {
        await createCategory(data);
      }
      navigation.goBack();
    };
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="checkmark-outline"
          size={30}
          color={'#000'}
          style={{marginRight: 10}}
          onPress={handleSubmit}
        />
      ),
    });
  }, [
    color,
    createCategory,
    navigation,
    selectedIcon,
    selectedParentCategory?.id,
    title,
  ]);

  return (
    <View style={modalStyles.container}>
      <ScrollView contentContainerStyle={modalStyles.content}>
        {/* Parent Category Picker */}
        <ParentCategoryPicker
          isVisible={showParentCategoryPicker}
          onClose={() => setShowParentCategoryPicker(false)}
          onSelect={handleSelectParentCategory}
        />
        <TouchableOpacity
          onPress={() => setShowParentCategoryPicker(true)}
          style={modalStyles.row}>
          <Text style={modalStyles.label}>Parent Category</Text>
          <View style={modalStyles.valueContainer}>
            <Text style={modalStyles.value}>
              {selectedParentCategory?.name || 'None'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>

        {/* Title */}
        <TextInput
          value={title}
          placeholder="Title"
          placeholderTextColor="#aaa"
          onChangeText={value => {
            console.log('Text changed value: ', value);
            setTitle(value);
          }}
          style={modalStyles.input}
        />

        {/* Color Picker */}
        <HueColorPicker
          onClose={() => setShowPicker(false)}
          visible={showPicker}
          onColorSelected={value => {
            setColor(value);
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPicker(!showPicker)}
          style={modalStyles.row}>
          <Text style={modalStyles.label}>Color</Text>
          <View style={[modalStyles.colorCircle, {backgroundColor: color}]} />
        </TouchableOpacity>

        {/* Icon Picker */}
        <IconChooserModal
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelectIcon={icon => {
            setSelectedIcon(icon);
            setShowIconPicker(false);
          }}
          iconColor={color}
        />
        <TouchableOpacity
          onPress={() => setShowIconPicker(true)}
          style={modalStyles.row}>
          <Text style={modalStyles.label}>Icon</Text>
          <Ionicons name={selectedIcon} size={24} color={color} />
        </TouchableOpacity>
        {category && (
          <TouchableOpacity
            onPress={handleDelete}
            style={[
              modalStyles.row,
              {
                justifyContent: 'center',
                backgroundColor: '#FF4D4D',
                marginTop: 15,
              },
            ]}>
            <Text style={[modalStyles.label, {color: '#FFF'}]}>
              Delete Category
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  cancelText: {
    fontSize: 18,
    color: '#007AFF',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
  },
  doneText: {
    fontSize: 18,
    color: '#007AFF',
  },
  content: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    marginRight: 5,
  },
  input: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    fontSize: 18,
    paddingVertical: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default CategoryModalScreen;
