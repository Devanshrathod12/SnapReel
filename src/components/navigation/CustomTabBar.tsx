import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icons } from '../../assets/icons';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const isReelsScreen = state.routes[state.index].name === 'Reels';

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, isReelsScreen && styles.safeAreaReels]}>
      <View style={[styles.container, isReelsScreen && styles.containerReels]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (route.name === 'Post') {
            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.postButtonContainer}
                activeOpacity={0.8}
              >
                <View style={[styles.postButton, isReelsScreen && styles.postButtonReels]}>
                  <Text style={[styles.postIcon, isReelsScreen && styles.postIconReels]}>+</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          let iconSource;
          switch (route.name) {
            case 'Home':
              iconSource = Icons.home;
              break;
            case 'Search':
              iconSource = Icons.search;
              break;
            case 'Reels':
              iconSource = Icons.reel;
              break;
            case 'Profile':
              // Using a placeholder remote image for the profile picture
              iconSource = { uri: 'https://randomuser.me/api/portraits/women/44.jpg' };
              break;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Image
                source={iconSource}
                style={[
                  styles.icon,
                  route.name === 'Profile' && styles.profilePic,
                  isFocused && route.name !== 'Profile' && { tintColor: isReelsScreen ? '#fff' : '#000' },
                  !isFocused && route.name !== 'Profile' && { tintColor: isReelsScreen ? '#aaa' : '#999' }
                ]}
                resizeMode="contain"
              />
              {isFocused && route.name !== 'Profile' && route.name !== 'Post' && (
                <View style={[styles.activeDot, isReelsScreen && { backgroundColor: '#fff' }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'visible',
  },
  safeAreaReels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  containerReels: {
    backgroundColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000',
    marginTop: 4,
    position: 'absolute',
    bottom: 12,
  },
  postButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButton: {
    width: 75,
    height: 45,
    backgroundColor: '#111',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  postButtonReels: {
    backgroundColor: '#fff',
  },
  postIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  postIconReels: {
    color: '#000',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    right: -2,
    backgroundColor: '#FFC107',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
  }
});
