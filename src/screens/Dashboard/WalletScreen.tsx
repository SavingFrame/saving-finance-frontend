import React, {useState} from 'react';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Wallet = {
  name: string;
  balance: number;
};

type WalletGroup = {
  title: string;
  data: Wallet[];
};

const SAMPLE_WALLETS: WalletGroup[] = [
  {
    title: 'Bank Wallets',
    data: [
      {name: 'Chase Wallet', balance: 5000},
      {name: 'Wells Fargo Wallet', balance: 2500},
    ],
  },
  {
    title: 'Crypto Wallets',
    data: [
      {name: 'Bitcoin Wallet', balance: 2},
      {name: 'Ethereum Wallet', balance: 5},
    ],
  },
];
const WalletScreen: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    SAMPLE_WALLETS.map(group => group.title),
  );

  const toggleGroupExpansion = (groupTitle: string) => {
    if (expandedGroups.includes(groupTitle)) {
      setExpandedGroups(prev => prev.filter(title => title !== groupTitle));
    } else {
      setExpandedGroups(prev => [...prev, groupTitle]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={SAMPLE_WALLETS}
        keyExtractor={(item, index) => item.name + index}
        renderSectionHeader={({section: {title}}) => (
          <TouchableOpacity
            style={styles.groupHeader}
            onPress={() => toggleGroupExpansion(title)}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
            <Ionicons
              name={
                expandedGroups.includes(title) ? 'chevron-up' : 'chevron-down'
              }
              size={20}
            />
          </TouchableOpacity>
        )}
        renderItem={({item, section: {title}}) =>
          expandedGroups.includes(title) ? (
            <TouchableOpacity style={styles.walletItem}>
              <Ionicons
                name="wallet-outline"
                size={24}
                style={{marginRight: 10}}
              />
              <Text style={{flex: 1, fontSize: 18}}>{item.name}</Text>
              <Text style={{fontSize: 18}}>${item.balance}</Text>
            </TouchableOpacity>
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
