import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReelsScreen from '../screens/social/ReelsScreen';

const Stack = createNativeStackNavigator();

const ReelStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReelsScreen" component={ReelsScreen} />
    </Stack.Navigator>
  );
};

export default ReelStack;
