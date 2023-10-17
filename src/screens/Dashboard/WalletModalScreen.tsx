import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HueColorPicker from '../../components/Additional/ColorPicker';
import IconChooserModal from '../../components/Settings/Category/IconChooserModal';
import {useGetWalletGroupsQuery} from '../../services/Dashboard/wallets';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {StackScreenProps} from '@react-navigation/stack/lib/typescript/src/types';

type Props = StackScreenProps<RootStackParamList, 'WalletModalScreen'>;

const WalletModalScreen = ({route}: Props) => {
  const {wallet} = route.params;

  const [name, setName] = useState(wallet?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(
    wallet?.icon || 'wallet-outline',
  );
  const [color, setColor] = useState(wallet?.color || '#808080');
  const [initialBalance, setInitialBalance] = useState(wallet?.balance || '');
  const [currency, setCurrency] = useState(wallet?.balance_currency || '');
  const [selectedGroup, setSelectedGroup] = useState(wallet?.group || null);

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {data: groups} = useGetWalletGroupsQuery();

  // const handleSelectGroup = (group) => {
  //   setSelectedGroup(group);
  //   setShowGroupPicker(false);
  // };

  // Your mutation functions for wallets
  // const [createWallet] = useCreateWalletMutation();
  // const [updateWallet] = useUpdateWalletMutation();

  // ... (similar event handlers, adjust for wallet)

  return (
    <View style={modalStyles.container}>
      <ScrollView contentContainerStyle={modalStyles.content}>
        {/* Name */}
        <TextInput
          value={name}
          placeholder="Wallet Name"
          placeholderTextColor="#aaa"
          onChangeText={setName}
          style={modalStyles.input}
        />

        <HueColorPicker
          onClose={() => setShowColorPicker(false)}
          visible={showColorPicker}
          onColorSelected={value => {
            setColor(value);
          }}
        />
        <TouchableOpacity
          onPress={() => setShowColorPicker(!showColorPicker)}
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

        {/* Initial Balance */}
        <TextInput
          value={initialBalance.toString()}
          placeholder="Initial Balance"
          placeholderTextColor="#aaa"
          onChangeText={value => setInitialBalance(parseFloat(value))}
          keyboardType="numeric"
          style={modalStyles.input}
        />

        {/* Currency */}
        <TextInput
          value={currency}
          placeholder="Currency (e.g., USD)"
          placeholderTextColor="#aaa"
          onChangeText={setCurrency}
          style={modalStyles.input}
        />

        {/* Group Picker */}
        <View>
          <Text style={modalStyles.label}>Group</Text>
          <Picker
            selectedValue={selectedGroup || 'none'}
            // style={modalStyles.picker}
            onValueChange={itemValue => {
              setSelectedGroup(itemValue);
            }}>
            {/*<Picker.Item label="None" value="none" />*/}
            {/*<Picker.Item label="Group 1" value="group1" />*/}
            {groups?.map(group => (
              <Picker.Item key={group.id} label={group.name} value={group.id} />
            ))}
          </Picker>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles (similar to your category modal)
const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  picker: {
    height: 50,
    width: 150,
  },
});

export default WalletModalScreen;
