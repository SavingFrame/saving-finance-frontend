import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './store';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
