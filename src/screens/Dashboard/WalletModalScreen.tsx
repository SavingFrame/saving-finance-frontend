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
import {
  useCreateWalletMutation,
  useGetWalletGroupsQuery,
  useUpdateWalletMutation,
  WalletBase,
} from '../../services/Dashboard/wallets';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {StackScreenProps} from '@react-navigation/stack/lib/typescript/src/types';

type Props = StackScreenProps<RootStackParamList, 'WalletModalScreen'>;

const WalletModalScreen = ({route, navigation}: Props) => {
  const {wallet} = route.params;

  const [walletData, setWalletData] = useState<WalletBase>({
    name: wallet?.name || '',
    icon: wallet?.icon || 'wallet-outline',
    color: wallet?.color || '#808080',
    balance: wallet?.balance || 0.0,
    balance_currency: wallet?.balance_currency || '',
    group: wallet?.group || null,
  });

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {data: groups} = useGetWalletGroupsQuery();

  const [createWallet] = useCreateWalletMutation();
  const [updateWallet] = useUpdateWalletMutation();
  const handleApplyPress = async () => {
    try {
      if (wallet) {
        // Update wallet since wallet object exists
        await updateWallet({...walletData, id: wallet.id});
      } else {
        // Create new wallet since wallet object doesn't exist
        await createWallet(walletData);
      }
      navigation.goBack(); // Navigate back after the operation
    } catch (error) {
      console.error('Failed to save wallet:', error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  };
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleApplyPress}>
          <Text style={{marginRight: 15, fontSize: 16}}>Apply</Text>
        </TouchableOpacity>
      ),
    });
  }, [walletData]);

  // Your mutation functions for wallets

  // ... (similar event handlers, adjust for wallet)

  return (
    <View style={modalStyles.container}>
      <ScrollView contentContainerStyle={modalStyles.content}>
        {/* Name */}
        <TextInput
          value={walletData.name}
          placeholder="Wallet Name"
          placeholderTextColor="#aaa"
          onChangeText={value => setWalletData({...walletData, name: value})}
          style={modalStyles.input}
        />

        <HueColorPicker
          onClose={() => setShowColorPicker(false)}
          visible={showColorPicker}
          onColorSelected={value => {
            setWalletData({...walletData, color: value});
          }}
        />
        <TouchableOpacity
          onPress={() => setShowColorPicker(!showColorPicker)}
          style={modalStyles.row}>
          <Text style={modalStyles.label}>Color</Text>
          <View
            style={[
              modalStyles.colorCircle,
              {backgroundColor: walletData.color},
            ]}
          />
        </TouchableOpacity>

        {/* Icon Picker */}
        <IconChooserModal
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelectIcon={icon => {
            setWalletData({...walletData, icon});
            setShowIconPicker(false);
          }}
          iconColor={walletData.color}
        />
        <TouchableOpacity
          onPress={() => setShowIconPicker(true)}
          style={modalStyles.row}>
          <Text style={modalStyles.label}>Icon</Text>
          <Ionicons name={walletData.icon} size={24} color={walletData.color} />
        </TouchableOpacity>

        {/* Initial Balance */}
        <TextInput
          value={walletData.balance.toString()}
          placeholder="Initial Balance"
          placeholderTextColor="#aaa"
          onChangeText={value =>
            setWalletData({...walletData, balance: parseFloat(value)})
          }
          keyboardType="numeric"
          style={modalStyles.input}
        />

        {/* Currency */}
        <TextInput
          value={walletData.balance_currency}
          placeholder="Currency (e.g., USD)"
          placeholderTextColor="#aaa"
          onChangeText={value =>
            setWalletData({...walletData, balance_currency: value})
          }
          style={modalStyles.input}
        />

        {/* Group Picker */}
        <View>
          <Text style={modalStyles.label}>Group</Text>
          <Picker
            selectedValue={walletData.group || 'none'}
            // style={modalStyles.picker}
            onValueChange={itemValue => {
              setWalletData({...walletData, group: Number(itemValue)});
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
