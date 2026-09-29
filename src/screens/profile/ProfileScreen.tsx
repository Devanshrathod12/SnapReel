import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { LayoutGrid, MapPin, Plus } from 'lucide-react-native';
import { Icons } from '../../assets/icons';
import { width, scale, verticalScale, moderateScale, fontScale } from '../../styles/responsive';

const GRID_PADDING = scale(10);
const GRID_GAP = scale(8);
const ITEM_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

const LockIcon = () => (
  <View style={styles.lockWrapper}>
    <View style={styles.lockShackle} />
    <View style={styles.lockBody}>
      <View style={styles.lockKeyhole} />
    </View>
  </View>
);

const ProfileScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<'Gallery' | 'Tags'>('Gallery');

  const data = activeTab === 'Gallery' ? user.gallery : user.tags;

  const [firstName, ...restName] = (user.name || '').split(' ');
  const lastName = restName.join(' ');

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.gridItem}>
      <Image
        source={item.image}
        style={styles.gridImage}
        blurRadius={item.isLocked ? (Platform.OS === 'ios' ? 25 : 15) : 0}
      />

      {item.isLocked && (
        <View style={styles.lockOverlay} pointerEvents="none">
          <LockIcon />
        </View>
      )}

      <View style={styles.ratingBadge}>
        <Image source={Icons.star} style={styles.starIcon} />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <View style={styles.likedByOverlay}>
        <View style={styles.likedByAvatars}>
          {item.likedBy.map((userLiked: any, idx: number) => (
            <Image
              key={idx}
              source={{ uri: userLiked.avatar }}
              style={[styles.smallAvatar, { marginLeft: idx > 0 ? -8 : 0 }]}
            />
          ))}
        </View>
        <Text style={styles.likedByText} numberOfLines={1}>
          {item.likedByText}
        </Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={styles.plusIconWrapper}>
              <Plus size={moderateScale(12)} color="#fff" strokeWidth={4} />
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.nameText}>
            {firstName} <Text style={styles.nameBold}>{lastName}</Text>
          </Text>
          <Text style={styles.bioText} numberOfLines={1}>
            {user.bio}
          </Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Gallery')}
          activeOpacity={0.8}
        >
          <LayoutGrid
            size={moderateScale(20)}
            color={activeTab === 'Gallery' ? '#fff' : '#8A8D96'}
            fill={activeTab === 'Gallery' ? '#fff' : 'transparent'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'Gallery' && styles.activeTabText]}>
            Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Tags')}
          activeOpacity={0.8}
        >
          <MapPin
            size={moderateScale(20)}
            color={activeTab === 'Tags' ? '#fff' : '#8A8D96'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'Tags' && styles.activeTabText]}>
            Tags
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        key={activeTab}
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        bounces
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  profileSection: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(30),
    backgroundColor: '#fff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    position: 'relative',
    width: moderateScale(78),
    height: moderateScale(78),
    borderRadius: moderateScale(39),
    borderWidth: 3,
    borderTopColor: '#FFD400',
    borderLeftColor: '#FFD400',
    borderRightColor: '#FF3B30',
    borderBottomColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(34),
  },
  plusIconWrapper: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#111',
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: '#fff',
    width: moderateScale(22),
    height: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: scale(16),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(24),
    color: '#000',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
    color: '#333',
    marginTop: -2,
  },
  bioSection: {
    marginTop: verticalScale(14),
  },
  nameText: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(17),
    color: '#000',
  },
  nameBold: {
    fontFamily: 'Poppins-Bold',
  },
  bioText: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
    color: '#777',
    marginTop: verticalScale(4),
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2B2D36',
    height: verticalScale(56),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: scale(8),
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(16),
    color: '#8A8D96',
  },
  activeTabText: {
    color: '#fff',
  },

  gridContainer: {
    backgroundColor: '#fff',
    paddingBottom: verticalScale(100),
  },
  columnWrapper: {
    paddingHorizontal: GRID_PADDING,
    marginTop: GRID_GAP,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  ratingBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(30, 30, 35, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderBottomLeftRadius: moderateScale(14),
  },
  starIcon: {
    width: moderateScale(12),
    height: moderateScale(12),
    tintColor: '#fff',
    marginRight: scale(4),
  },
  ratingText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(12),
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockShackle: {
    width: moderateScale(20),
    height: moderateScale(18),
    borderWidth: moderateScale(3.5),
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    marginBottom: -1,
  },
  lockBody: {
    width: moderateScale(32),
    height: moderateScale(24),
    backgroundColor: '#fff',
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockKeyhole: {
    width: moderateScale(6),
    height: moderateScale(9),
    borderRadius: moderateScale(3),
    backgroundColor: 'rgba(60, 60, 70, 0.9)',
  },

  likedByOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 35, 0.55)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(7),
  },
  likedByAvatars: {
    flexDirection: 'row',
    marginRight: scale(8),
  },
  smallAvatar: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  likedByText: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(10),
  },
});