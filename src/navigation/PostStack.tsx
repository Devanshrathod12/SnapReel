import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePostScreen from '../screens/social/CreatePostScreen';

const Stack = createNativeStackNavigator();

const PostStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
    </Stack.Navigator>
  );
};

export default PostStack;
