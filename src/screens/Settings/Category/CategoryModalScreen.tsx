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
import {Category} from '../../../services/Settings/Category/requests';
import ParentCategoryPicker from '../../../components/Settings/Category/ParentCategoryPicker';
import type {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'CategoryModal'>;

const CategoryModalScreen = ({route}: Props) => {
  const {category, parent} = route.params;
  console.log('category', category, 'parent', parent);
  const [title, setTitle] = useState(category?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(
    category?.icon || 'fast-food-outline',
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [color, setColor] = useState(category?.color || '#808080');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<Category | null>(parent);
  const [showParentCategoryPicker, setShowParentCategoryPicker] =
    useState(false);

  const handleSelectParentCategory = (ct: Category) => {
    setSelectedParentCategory(ct);
    setShowParentCategoryPicker(false);
  };

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
          onChangeText={setTitle}
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
      </ScrollView>

      {/* Other modals... */}
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
