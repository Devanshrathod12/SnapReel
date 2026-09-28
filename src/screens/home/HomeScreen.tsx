import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Icons } from '../../assets/icons';
import { Story, Post } from '../../redux/slices/feedSlice';
import { width, fontScale, scale, verticalScale, moderateScale } from '../../styles/responsive';

const HomeScreen = () => {
  const { stories, posts } = useSelector((state: RootState) => state.feed);

  const renderStory = ({ item }: { item: Story }) => (
    <View style={styles.storyContainer}>
      <View style={[styles.storyRing, item.isSeen ? styles.storySeen : styles.storyUnseen]}>
        <Image source={{ uri: item.user.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName}>{item.user.name}</Text>
    </View>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Dark overlay effects for readability at top and bottom, leaving the center clear */}
      <View style={styles.postTopOverlay} />
      <View style={styles.postBottomOverlay} />

      {/* Post Header */}
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

      {/* Post Bottom Content */}
      <View style={styles.postBottom}>
        <View style={styles.tagsContainer}>
          {item.tags.map(tag => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.captionText}>{item.caption}</Text>

        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <Image source={Icons.like} style={styles.actionIcon} />
            <Text style={styles.actionText}>{item.likes}</Text>
          </View>
          <View style={styles.actionItem}>
            <Image source={Icons.dislike} style={styles.actionIcon} />
            <Text style={styles.actionText}>{item.dislikes}</Text>
          </View>
          <View style={styles.actionItem}>
            <Image source={Icons.chat} style={styles.actionIcon} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </View>
          <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
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
          <Text style={styles.likedByText}>{item.likedByText}</Text>
          <TouchableOpacity style={styles.moreOptionsBtn}>
            <Text style={styles.moreOptionsText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <View style={styles.headerTabs}>
          <View style={styles.activeTabContainer}>
            <Text style={styles.headerTabActive}>Feed</Text>
            <View style={styles.activeDot} />
          </View>
          <Text style={styles.headerTabInactive}>Reels</Text>
        </View>
        <View style={styles.headerIcons}>
          <Image source={Icons.heart} style={styles.headerIcon} />
          <Image source={Icons.send} style={styles.headerIcon} />
        </View>
      </View>

      {/* Top Stories Row (Fixed at Top) */}
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

      {/* Main Feed Posts (Horizontal Swipe) */}
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
  headerIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    marginLeft: scale(20),
    tintColor: '#000',
  },
  storiesWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: verticalScale(15),
    marginBottom: verticalScale(10),
  },
  storiesContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(10),
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: scale(8),
  },
  storyRing: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(34),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  storyUnseen: {
    borderColor: '#F5A623',
  },
  storySeen: {
    borderColor: 'transparent',
  },
  storyAvatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyName: {
    marginTop: verticalScale(6),
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
    color: '#333',
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
    height: verticalScale(120),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  postBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(250),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  postHeader: {
    position: 'absolute',
    top: verticalScale(20),
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
    borderWidth: 1,
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
    bottom: verticalScale(20),
    left: scale(15),
    right: scale(15),
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
    marginBottom: verticalScale(15),
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: verticalScale(15),
  },
  likedByAvatars: {
    flexDirection: 'row',
    marginRight: scale(10),
  },
  smallAvatar: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOptionsText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});
