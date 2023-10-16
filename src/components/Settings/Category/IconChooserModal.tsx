import React from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IoniconsGlyphs from 'react-native-vector-icons/glyphmaps/Ionicons.json';

interface IconChooserModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (icon: string) => void;
  iconColor?: string;
}

const ICONS = Object.keys(IoniconsGlyphs);
const NUM_COLUMNS = 4;

const IconChooserModal: React.FC<IconChooserModalProps> = ({
  visible,
  onClose,
  onSelectIcon,
  iconColor,
}) => {
  const [search, setSearch] = React.useState('');
  const filteredIcons = ICONS.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={30} color={'#000'} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose an Icon</Text>
            <View style={{width: 60, height: 1}} />
          </View>

          <TextInput
            style={styles.searchInput}
            onChangeText={text => setSearch(text)}
            value={search}
            placeholder="Search..."
          />

          <FlatList
            data={filteredIcons}
            numColumns={NUM_COLUMNS}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => onSelectIcon(item)}>
                <Ionicons name={item} size={30} color={iconColor || '#000'} />
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 10,
  },
  closeText: {
    fontSize: 16,
    color: 'blue',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});

export default IconChooserModal;
