import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import SocialStack from './SocialStack';
import PostStack from './PostStack';
import ReelStack from './ReelStack';
import ProfileStack from './ProfileStack';
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SocialStack} options={{ headerShown: false }} />
      <Tab.Screen name="Post" component={PostStack} options={{ headerShown: false }} />
      <Tab.Screen name="Reels" component={ReelStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
