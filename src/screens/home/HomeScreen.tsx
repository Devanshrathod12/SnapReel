import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { Icons } from '../../assets/icons';
import { Story, Post, toggleLike, toggleDislike } from '../../redux/slices/feedSlice';
import { width, fontScale, scale, verticalScale, moderateScale } from '../../styles/responsive';
import { Heart, Send, ThumbsUp, ThumbsDown } from 'lucide-react-native';

const LikeAction = ({ post }: { post: Post }) => {
  const dispatch = useDispatch();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    dispatch(toggleLike(post.id));
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleValue, { toValue: 1, friction: 3, useNativeDriver: true })
    ]).start();
  };

  return (
    <TouchableOpacity style={styles.actionItem} onPress={handleLike} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale: scaleValue }], marginRight: scale(6) }}>
        <ThumbsUp
          size={moderateScale(20)}
          color="#fff"
          fill={post.isLiked ? '#fff' : 'transparent'}
        />
      </Animated.View>
      <Text style={[styles.actionText, post.isLiked && { fontFamily: 'Poppins-SemiBold' }]}>{post.likes}</Text>
    </TouchableOpacity>
  );
};

const DislikeAction = ({ post }: { post: Post }) => {
  const dispatch = useDispatch();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handleDislike = () => {
    dispatch(toggleDislike(post.id));
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleValue, { toValue: 1, friction: 3, useNativeDriver: true })
    ]).start();
  };

  return (
    <TouchableOpacity style={styles.actionItem} onPress={handleDislike} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale: scaleValue }], marginRight: scale(6) }}>
        <ThumbsDown
          size={moderateScale(20)}
          color="#fff"
          fill={post.isDisliked ? '#fff' : 'transparent'}
        />
      </Animated.View>
      <Text style={[styles.actionText, post.isDisliked && { fontFamily: 'Poppins-SemiBold' }]}>{post.dislikes}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const { stories, posts } = useSelector((state: RootState) => state.feed);

  const navigation = useNavigation<any>();

  const renderStory = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.storyContainer}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('StoryScreen')}
    >
      <View style={[styles.storyRing, item.isSeen ? styles.storySeen : styles.storyUnseen]}>
        <Image source={{ uri: item.user.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName}>{item.user.name}</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postTopOverlay} />

      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <Image source={{ uri: item.user.avatar }} style={styles.postHeaderAvatar} />
          <Text style={styles.postHeaderName}>{item.user.name}</Text>
        </View>
        <View style={styles.postHeaderRight}>
          <Image source={Icons.star} style={styles.starIcon} />
          <Image source={Icons.star} style={styles.starIcon} />
          <Image source={Icons.star} style={styles.starIcon} />
          <Image source={Icons.star} style={styles.starIcon} />
          <Image source={Icons.star} style={[styles.starIcon, { opacity: 0.5 }]} />
          <Text style={styles.ratingText}>{item.user.rating}</Text>
        </View>
      </View>

      <View style={styles.postBottom}>
        <View style={styles.postBottomContent}>
          <View style={styles.tagsContainer}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.captionText}>{item.caption}</Text>

          <View style={styles.actionsRow}>
            <LikeAction post={item} />
            <DislikeAction post={item} />
            <View style={styles.actionItem}>
              <Image source={Icons.chat} style={styles.actionIcon} />
              <Text style={styles.actionText}>{item.comments}</Text>
            </View>
            <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.likedByAvatars}>
            {item.likedBy.map((user, idx) => (
              <Image
                key={idx}
                source={{ uri: user.avatar }}
                style={[styles.smallAvatar, { marginLeft: idx > 0 ? -10 : 0 }]}
              />
            ))}
          </View>
          <Text style={styles.likedByText} numberOfLines={1}>
            {item.likedByText}
          </Text>
          <TouchableOpacity style={styles.moreOptionsBtn}>
            <Text style={styles.moreOptionsText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* @ts-ignore - backgroundColor is an Android-only prop that sometimes causes TS errors in newer @types/react-native */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.headerTabs}>
          <View style={styles.activeTabContainer}>
            <Text style={styles.headerTabActive}>Feed</Text>
            <View style={styles.activeDot} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Reels')}>
            <Text style={styles.headerTabInactive}>Reels</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerIcons}>
          <Heart color="#000" size={moderateScale(26)} strokeWidth={1.5} style={{ marginLeft: scale(20) }} />
          <Send color="#000" size={moderateScale(26)} strokeWidth={1.5} style={{ marginLeft: scale(16) }} />
        </View>
      </View>

      <View style={styles.storiesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={renderStory}
          contentContainerStyle={styles.storiesContainer}
        />
      </View>

      <FlatList
        data={posts}
        horizontal
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        style={styles.feedList}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    backgroundColor: '#fff',
  },
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabContainer: {
    alignItems: 'center',
    marginRight: scale(20),
  },
  headerTabActive: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(24),
    color: '#000',
  },
  activeDot: {
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: '#000',
    marginTop: verticalScale(4),
  },
  headerTabInactive: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(24),
    color: '#999',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storiesWrapper: {
    paddingBottom: verticalScale(8),
    backgroundColor: '#fff',
  },
  storiesContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(6),
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: scale(6),
  },
  storyRing: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  storyUnseen: {
    borderColor: '#E9A26A',
  },
  storySeen: {
    borderColor: 'transparent',
  },
  storyAvatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: '#eee',
  },
  storyName: {
    marginTop: verticalScale(6),
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(13),
    color: '#111',
  },
  feedList: {
    flex: 1,
  },
  postContainer: {
    width: width,
    height: '100%',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(60),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  postHeader: {
    position: 'absolute',
    top: verticalScale(10),
    left: scale(15),
    right: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: scale(10),
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  postHeaderName: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: fontScale(14),
  },
  postHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: moderateScale(14),
    height: moderateScale(14),
    tintColor: '#fff',
    marginLeft: scale(2),
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: fontScale(14),
    marginLeft: scale(6),
  },
  postBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  postBottomContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(12),
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(10),
  },
  tagBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(15),
    marginRight: scale(10),
  },
  tagText: {
    fontFamily: 'Poppins-Medium',
    color: '#000',
    fontSize: fontScale(12),
  },
  captionText: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: fontScale(20),
    marginBottom: verticalScale(15),
    lineHeight: fontScale(28),
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(20),
  },
  actionIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: '#fff',
    marginRight: scale(6),
  },
  actionText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: fontScale(12),
  },
  timeAgoText: {
    fontFamily: 'Poppins-Regular',
    color: '#ddd',
    fontSize: fontScale(12),
    marginLeft: 'auto',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  likedByAvatars: {
    flexDirection: 'row',
    marginRight: scale(10),
  },
  smallAvatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#fff',
  },
  likedByText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: fontScale(12),
    flex: 1,
  },
  moreOptionsBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOptionsText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});