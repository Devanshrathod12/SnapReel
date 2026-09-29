import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell } from 'lucide-react-native';
import { Icons } from '../../assets/icons';
import { width, scale, verticalScale, moderateScale, fontScale } from '../../styles/responsive';

const YELLOW = '#F8B81C';
const GRID_PADDING = scale(16);
const GRID_GAP = scale(10);
const ITEM_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

const RECENT_SEARCHES = [
  { id: 'r1', label: 'Travel', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'r2', label: 'Fitness', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 'r3', label: 'Food', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { id: 'r4', label: 'Music', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 'r5', label: 'Fashion', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
];

const TRENDING_CREATORS = [
  {
    id: 'c1',
    handle: '@jane.cooper',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    ring: '#F8B81C',
  },
  {
    id: 'c2',
    handle: '@robertfox',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    ring: '#F8B81C',
  },
  {
    id: 'c3',
    handle: '@leslieale',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    ring: '#FF6B3D',
  },
  {
    id: 'c4',
    handle: '@guyhawkins',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    ring: '#FF6B3D',
  },
  {
    id: 'c5',
    handle: '@estherhoward',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    ring: '#FF3B30',
  },
];

const CATEGORIES = ['All', 'Travel', 'Fashion', 'Food', 'Music', 'Fitness'];

const DISCOVER_POSTS = [
  {
    id: 'p1',
    image: require('../../assets/images/snapreel_clean_image_4.png'),
    rating: 4.8,
    likedByText: 'Liked by 2156 users',
    likedBy: [
      { avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    ],
  },
  {
    id: 'p2',
    image: require('../../assets/images/snapreel_clean_image_5.png'),
    rating: 3.6,
    likedByText: 'Liked by 487 users',
    likedBy: [
      { avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
      { avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
    ],
  },
  {
    id: 'p3',
    image: require('../../assets/images/snapreel_clean_image_7.png'),
    rating: 4.2,
    likedByText: 'Liked by 2156 users',
    likedBy: [
      { avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
  },
  {
    id: 'p4',
    image: require('../../assets/images/snapreel_clean_image_6.png'),
    rating: 4.4,
    likedByText: 'Liked by 512 users',
    likedBy: [
      { avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
      { avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
    ],
  },
];

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recent, setRecent] = useState(RECENT_SEARCHES);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.gridItem}>
      <Image source={item.image} style={styles.gridImage} />

      <View style={styles.ratingBadge}>
        <Image source={Icons.star} style={styles.starIcon} />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <View style={styles.likedByOverlay}>
        <View style={styles.likedByAvatars}>
          {item.likedBy.map((u: any, idx: number) => (
            <Image
              key={idx}
              source={{ uri: u.avatar }}
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
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
          <Bell color="#111" size={moderateScale(22)} strokeWidth={1.8} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Search color="#111" size={moderateScale(18)} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search creators, tags, or videos..."
          placeholderTextColor="#9A9AA3"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {recent.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={() => setRecent([])} activeOpacity={0.7}>
              <Text style={styles.sectionAction}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            {recent.map((item) => (
              <TouchableOpacity key={item.id} style={styles.recentItem} activeOpacity={0.8}>
                <Image source={{ uri: item.avatar }} style={styles.recentAvatar} />
                <Text style={styles.recentLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Creators</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sectionAction}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {TRENDING_CREATORS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.creatorItem} activeOpacity={0.8}>
              <View style={[styles.creatorRing, { borderColor: item.ring }]}>
                <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
              </View>
              <Text style={styles.creatorHandle} numberOfLines={1}>
                {item.handle}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={DISCOVER_POSTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(12),
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: fontScale(22),
    color: '#000',
  },
  bellButton: {
    width: moderateScale(34),
    height: moderateScale(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: moderateScale(4),
    right: moderateScale(5),
    width: moderateScale(9),
    height: moderateScale(9),
    borderRadius: moderateScale(5),
    backgroundColor: YELLOW,
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(16),
    height: verticalScale(46),
    borderRadius: moderateScale(14),
    backgroundColor: '#F3F3F5',
    paddingHorizontal: scale(14),
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    padding: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
    color: '#000',
  },

  section: {
    marginTop: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(15),
    color: '#000',
  },
  sectionAction: {
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(12),
    color: YELLOW,
  },
  hList: {
    paddingHorizontal: scale(16),
  },

  recentItem: {
    alignItems: 'center',
    marginRight: scale(14),
  },
  recentAvatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: '#ddd',
  },
  recentLabel: {
    marginTop: verticalScale(6),
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(11),
    color: '#111',
  },

  creatorItem: {
    alignItems: 'center',
    width: moderateScale(72),
    marginRight: scale(12),
  },
  creatorRing: {
    width: moderateScale(58),
    height: moderateScale(58),
    borderRadius: moderateScale(29),
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: '#ddd',
  },
  creatorHandle: {
    marginTop: verticalScale(6),
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(10),
    color: '#111',
  },

  chipsRow: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(18),
    paddingBottom: verticalScale(4),
    alignItems: 'center',
  },
  chip: {
    height: moderateScale(34),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(17),
    backgroundColor: '#F3F3F5',
    justifyContent: 'center',
    marginRight: scale(8),
  },
  chipActive: {
    backgroundColor: '#0D0D0D',
  },
  chipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(12),
    color: '#111',
  },
  chipTextActive: {
    color: '#fff',
  },

  gridContainer: {
    backgroundColor: '#fff',
    paddingBottom: verticalScale(110),
  },
  columnWrapper: {
    paddingHorizontal: GRID_PADDING,
    marginTop: GRID_GAP,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    borderRadius: moderateScale(16),
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
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
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