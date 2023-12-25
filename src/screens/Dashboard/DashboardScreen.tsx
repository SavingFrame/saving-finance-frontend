import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getDateFilterParams,
  useGetTransactionsQuery,
} from '../../services/Dashboard/transactions';
import {
  Category,
  Subcategory,
  useGetCategoriesQuery,
} from '../../services/Settings/categories';
import {useGetWalletsQuery, Wallet} from '../../services/Dashboard/wallets';

// Mocked transactions data - replace with actual API data.

const DashboardScreen = () => {
  const [selectedTab, setSelectedTab] = useState('recent');

  const [page, setPage] = useState(1);
  const [transactionsData, setTransactionsData] = useState<
    TransactionSection[]
  >([]);

  const tabs = [
    'Recent',
    'Today',
    'Yesterday',
    'Last Week',
    'Last Month',
    // 'Custom',
  ]; // Add tabs as needed
  const filterParams = getDateFilterParams(selectedTab);
  const {data: transactions, isSuccess: transactionsSuccess} =
    useGetTransactionsQuery({page, ...filterParams});
  const {data: categories, isSuccess: categoriesSuccess} =
    useGetCategoriesQuery();
  const {data: wallets, isSuccess: walletsSuccess} = useGetWalletsQuery();

  const categoryLookup = categories?.reduce((acc, category) => {
    acc[category.id] = category;

    category.subcategories.forEach(subCat => {
      acc[subCat.id] = subCat;
    });

    return acc;
  }, {} as {[id: number]: (typeof categories)[0] | (typeof categories)[0]['subcategories'][0]});

  const getCategoryById = (
    categoryId: number,
  ): Category | Subcategory | undefined => {
    return categoryLookup?.[categoryId] || undefined;
  };

  // Helper function to get wallet details by ID
  const getWalletById = (walletId: number): Wallet | undefined => {
    return wallets?.find(wallet => wallet.id === walletId) || undefined;
  };

  const handleShowMore = () => {
    // if (selectedTab === 'today') {
    setPage(prev => prev + 1); // Load the next page
    // } else {
    //   setPage(1); // Reset to first page without date filtration
    //   setSelectedTab('today');
    // }
  };

  type TransactionItem = {
    categoryIcon: string;
    categoryName: string;
    price: number;
    currency: string;
    description: string;
    walletName: string;
    walletIcon: string;
    id: number;
  };

  type TransactionSection = {
    title: string;
    data: TransactionItem[];
  };

  useEffect(() => {
    // Reset the data and page number whenever the tab changes
    setPage(1);
    setTransactionsData([]);
  }, [selectedTab]);

  useEffect(() => {
    if (
      transactionsSuccess &&
      categoriesSuccess &&
      walletsSuccess &&
      transactions
    ) {
      const formattedData: TransactionSection[] = transactions.results.reduce(
        (acc: TransactionSection[], transaction) => {
          const category = getCategoryById(transaction.category);
          const wallet = getWalletById(transaction.wallet);
          const transactionItem: TransactionItem = {
            id: transaction.id,
            categoryIcon: category?.icon || 'help-circle-outline',
            categoryName: category?.name || 'Unknown',
            price: transaction.amount,
            currency: transaction.currency_symbol,
            description: transaction.description,
            walletName: wallet?.name || 'Unknown',
            walletIcon: wallet?.icon || 'help-circle-outline',
          };

          const date = new Date(transaction.transaction_date).toDateString();

          const section = acc.find(sec => sec.title === date);
          if (section) {
            section.data.push(transactionItem);
          } else {
            acc.push({
              title: date,
              data: [transactionItem],
            });
          }
          return acc;
        },
        [],
      );

      setTransactionsData(prevData => [...prevData, ...formattedData]);
    }
  }, [transactionsSuccess, categoriesSuccess, walletsSuccess, transactions]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs for time filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab.toLowerCase())}>
            <Text
              style={
                selectedTab === tab.toLowerCase()
                  ? styles.selectedTab
                  : styles.tab
              }>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List of Transactions */}
      <SectionList
        sections={transactionsData}
        keyExtractor={item => item.id.toString()}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({item}) => (
          <View style={styles.transactionItem}>
            {/* Category Icon */}
            <Ionicons
              name={item.categoryIcon}
              size={24}
              style={{marginRight: 10}}
            />
            <View style={{flex: 1}}>
              {/* Category Name */}
              <Text style={{fontSize: 18}}>{item.categoryName}</Text>
              {/* Description */}
              <Text style={{fontSize: 14, color: 'gray', marginTop: 4}}>
                {item.description}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* Wallet Name + Icon */}
              <Text style={{fontSize: 14, marginRight: 5}}>
                {item.walletName}
              </Text>
              <Ionicons
                name={item.walletIcon}
                size={20}
                style={{marginLeft: 5}}
              />
              {/* Price with currency */}
              <Text
                style={{
                  fontSize: 18,
                  color: item.price > 0 ? 'green' : 'red',
                  marginLeft: 10,
                }}>
                {item.currency} {item.price}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={() => {
          if (transactions?.next) {
            return (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleShowMore}>
                <Text style={styles.showMoreText}>Show More</Text>
              </TouchableOpacity>
            );
          }
          return null;
        }}
      />
      {/* Show More button */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  tab: {
    fontSize: 16,
    marginHorizontal: 10,
    paddingBottom: 5,
  },
  selectedTab: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: '#007AFF', // iOS blue color
    paddingBottom: 5,
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#F1F1F3', // Lighter background color
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderRadius: 10, // Rounded corners
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000', // iOS style shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  showMoreButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
