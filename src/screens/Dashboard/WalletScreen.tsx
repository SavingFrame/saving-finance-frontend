import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContextMenu from 'react-native-context-menu-view';
import {
  useGetWalletGroupsQuery,
  useGetWalletsQuery,
  Wallet,
} from '../../services/Dashboard/wallets';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {StackScreenProps} from '@react-navigation/stack/lib/typescript/src/types';

type WalletGroupSection = {
  title: string;
  data: Wallet[];
  id: number;
};

type Props = StackScreenProps<RootStackParamList, 'Wallet'>;

const WalletScreen = ({navigation}: Props) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    [] as string[],
  );

  const {data: walletsData} = useGetWalletsQuery();
  const {data: walletGroupsData} = useGetWalletGroupsQuery();

  // Organize the wallets by group
  const groupedWallets: WalletGroupSection[] =
    walletGroupsData?.map(group => ({
      title: group.name,
      id: group.id,
      data: walletsData?.filter(wallet => wallet.group === group.id) || [],
    })) || [];

  useEffect(() => {
    if (walletGroupsData) {
      setExpandedGroups(walletGroupsData.map(group => String(group.id)));
    }
  }, [walletGroupsData]);

  const toggleGroupExpansion = (groupId: string) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(prev => prev.filter(id => id !== groupId));
    } else {
      setExpandedGroups(prev => [...prev, groupId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={groupedWallets}
        keyExtractor={(item, index) => item.name + index}
        renderSectionHeader={({section: {title, id}}) => (
          <TouchableOpacity
            style={styles.groupHeader}
            onPress={() => toggleGroupExpansion(String(id))}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
            <Ionicons
              name={
                expandedGroups.includes(String(id))
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={20}
            />
          </TouchableOpacity>
        )}
        renderItem={({item, section}) =>
          expandedGroups.includes(String(section.id)) ? (
            <ContextMenu
              onPress={e => {
                if (e.nativeEvent.name === 'Edit') {
                  navigation.navigate('WalletModalScreen', {wallet: item});
                } else {
                  console.warn(
                    `Pressed ${e.nativeEvent.name} at index ${e.nativeEvent.index}`,
                  );
                }
              }}
              actions={[
                {
                  title: 'Edit',
                  systemIcon: 'pencil',
                },
              ]}>
              <TouchableOpacity style={styles.walletItem}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  style={{marginRight: 10}}
                  color={item.color}
                />
                <Text style={{flex: 1, fontSize: 18}}>{item.name}</Text>
                <Text style={{fontSize: 18}}>
                  {item.currency_symbol} {item.balance}
                </Text>
              </TouchableOpacity>
            </ContextMenu>
          ) : null
        }
        ListHeaderComponent={() => (
          <TouchableOpacity style={styles.allWalletsButton}>
            <Text style={{color: 'white'}}>All Wallets</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupHeader: {
    padding: 10,
    backgroundColor: '#e5e5e5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  allWalletsButton: {
    padding: 10,
    margin: 10,
    backgroundColor: '#007AFF',
    borderRadius: 7,
    alignItems: 'center',
  },
});

export default WalletScreen;
