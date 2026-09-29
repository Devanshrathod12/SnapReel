import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  LayoutChangeEvent,
  Platform,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Video from 'react-native-video';
import { RootState } from '../../redux/store';
import { toggleLike, toggleDislike, toggleSave, toggleFollow, addComment, toggleCommentLike } from '../../redux/slices/reelSlice';
import {
  ChevronLeft,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Bookmark,
  NavigationOff,
  Navigation,
} from 'lucide-react-native';
import { Icons } from '../../assets/icons';
import { scale, verticalScale, moderateScale, fontScale } from '../../styles/responsive';
import { useNavigation } from '@react-navigation/native';
const TAB_BAR_SPACE = verticalScale(70);

const ReelItem = ({
  item,
  isActive,
  height,
}: {
  item: any;
  isActive: boolean;
  height: number;
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [videoReady, setVideoReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const filledStars = Math.floor(item.rating);
  const navigation = useNavigation();
  const scaleValueLike = useRef(new Animated.Value(1)).current;
  const scaleValueDislike = useRef(new Animated.Value(1)).current;
  const scaleValueSave = useRef(new Animated.Value(1)).current;

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Reset videoReady state when isActive changes, to ensure video reloads if it was inactive
  React.useEffect(() => {
    if (!isActive) {
      setVideoReady(false);
      setIsBuffering(true);
      setProgress(0);
    }
  }, [isActive]);

  const handleLike = () => {
    Animated.sequence([
      Animated.spring(scaleValueLike, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(scaleValueLike, { toValue: 1, useNativeDriver: true }),
    ]).start();
    dispatch(toggleLike(item.id));
  };

  const handleDislike = () => {
    Animated.sequence([
      Animated.spring(scaleValueDislike, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(scaleValueDislike, { toValue: 1, useNativeDriver: true }),
    ]).start();
    dispatch(toggleDislike(item.id));
  };

  const handleSave = () => {
    Animated.sequence([
      Animated.spring(scaleValueSave, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(scaleValueSave, { toValue: 1, useNativeDriver: true }),
    ]).start();
    dispatch(toggleSave(item.id));
  };

  const handleFollow = () => {
    dispatch(toggleFollow(item.id));
  };

  const handleSendComment = () => {
    if (commentText.trim().length > 0) {
      dispatch(addComment({ reelId: item.id, text: commentText }));
      setCommentText('');
    }
  };

  const handleCommentLike = (commentId: string) => {
    dispatch(toggleCommentLike({ reelId: item.id, commentId }));
  };

  return (
    <View style={[styles.reelContainer, { height }]}>
      {isActive ? (
        <Video
          source={{ uri: item.videoUrl }}
          ref={videoRef}
          style={styles.media} // Always show the video player when active
          resizeMode="cover"
          repeat
          muted={false} // Ensure audio is not muted
          paused={!isActive} // Pause if not active, play if active
          onLoadStart={() => setIsBuffering(true)}
          onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
          onLoad={(data) => {
            setDuration(data.duration);
            setIsBuffering(false);
          }}
          onProgress={(data) => {
            setProgress(data.currentTime);
          }}
          onReadyForDisplay={() => {
            setVideoReady(true);
            setIsBuffering(false);
          }}
          onError={(e) => {
            console.log("Video Error:", e);
            setIsBuffering(false);
          }}
        />
      ) : (
        // Show thumbnail when not active
        <Image source={{ uri: item.thumbnail }} style={styles.media} />
      )}

      {isActive && isBuffering && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {isActive && (
        <View style={[styles.progressContainer, { bottom: TAB_BAR_SPACE }]}>
          <View style={[styles.progressBar, { width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }]} />
        </View>
      )}


      <View style={styles.bottomShade} pointerEvents="none" />

      <View style={[styles.topControls, { top: insets.top + verticalScale(10) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleButton} activeOpacity={0.8}>
          <ChevronLeft color="#fff" size={moderateScale(22)} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} activeOpacity={0.8}>
          <MoreVertical color="#fff" size={moderateScale(22)} />
        </TouchableOpacity>
      </View>

      <View style={[styles.leftPanel, { top: insets.top + verticalScale(75) }]}>
        <View style={styles.ratingPill}>
          {[5, 4, 3, 2, 1].map((i) => (
            <Image
              key={i}
              source={Icons.star}
              style={[styles.starSmall, i > filledStars && styles.starEmpty]}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>

        <View style={styles.datePillWrapper}>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.rightPanel, { bottom: TAB_BAR_SPACE + verticalScale(125) }]}>
        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionCircle} activeOpacity={0.8} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: scaleValueLike }] }}>
              <ThumbsUp color="#fff" size={moderateScale(20)} fill={item.isLiked ? "#fff" : "transparent"} />
            </Animated.View>
          </TouchableOpacity>
          <Text style={[styles.actionText, item.isLiked && { fontFamily: 'Poppins-SemiBold' }]}>{item.likes}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionCircle} activeOpacity={0.8} onPress={handleDislike}>
            <Animated.View style={{ transform: [{ scale: scaleValueDislike }] }}>
              <ThumbsDown color="#fff" size={moderateScale(20)} fill={item.isDisliked ? "#fff" : "transparent"} />
            </Animated.View>
          </TouchableOpacity>
          <Text style={[styles.actionText, item.isDisliked && { fontFamily: 'Poppins-SemiBold' }]}>{item.dislikes}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionPlain} activeOpacity={0.8} onPress={() => setCommentsVisible(true)}>
            <MessageCircle color="#fff" size={moderateScale(20)} />
          </TouchableOpacity>
          <Text style={styles.actionText}>{item.comments}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity
            style={[styles.actionCircle, styles.bookmarkCircle]}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Animated.View style={{ transform: [{ scale: scaleValueSave }] }}>
              <Bookmark color="#fff" size={moderateScale(20)} fill={item.isSaved ? "#fff" : "transparent"} />
            </Animated.View>
          </TouchableOpacity>
          <Text style={[styles.actionText, item.isSaved && { fontFamily: 'Poppins-SemiBold' }]}>{item.bookmarks}</Text>
        </View>
      </View>

      <View style={[styles.bottomInfo, { bottom: TAB_BAR_SPACE }]}>
        <View style={styles.userInfoRow}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.followersText}>{item.user.followers}</Text>
          </View>
          <TouchableOpacity
            style={[styles.followButton, item.isFollowing && styles.followingButton]}
            activeOpacity={0.85}
            onPress={handleFollow}
          >
            <Text style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
              {item.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.caption} numberOfLines={1}>
          {item.caption}
        </Text>

        <View style={styles.likedByRow}>
          <View style={styles.likedByAvatars}>
            {item.likedBy.map((lb: any, idx: number) => (
              <Image
                key={idx}
                source={{ uri: lb.avatar }}
                style={[styles.smallAvatar, { marginLeft: idx > 0 ? -10 : 0 }]}
              />
            ))}
          </View>
          <Text style={styles.likedByText} numberOfLines={1}>
            {item.likedByText}
          </Text>
        </View>
      </View>

      <Modal
        visible={commentsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentsVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismissArea} activeOpacity={1} onPress={() => setCommentsVisible(false)} />
          <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{item.comments} Comments</Text>
              <TouchableOpacity onPress={() => setCommentsVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={item.commentsList || []}
              keyExtractor={(c) => c.id}
              renderItem={({ item: c }) => (
                <View style={styles.commentItem}>
                  <Image source={{ uri: c.user.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentBody}>
                    <Text style={styles.commentName}>{c.user.name} <Text style={styles.commentTime}>{c.timeAgo}</Text></Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                  <TouchableOpacity style={styles.commentLikeBtn} onPress={() => handleCommentLike(c.id)}>
                    <ThumbsUp size={moderateScale(14)} color={c.isLiked ? "red" : "#999"} fill={c.isLiked ? "red" : "transparent"} />
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ padding: scale(16) }}
            />
            <View style={styles.commentInputRow}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.commentInputAvatar} />
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#999"
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={handleSendComment}
              />
              <TouchableOpacity onPress={handleSendComment} disabled={commentText.trim().length === 0}>
                <Text style={[styles.sendBtnText, commentText.trim().length > 0 && { color: '#007bff' }]}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const ReelsScreen = () => {
  const reels = useSelector((state: RootState) => state.reels.reels);
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h !== itemHeight) setItemHeight(h);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* @ts-ignore - backgroundColor is an Android-only prop that sometimes causes TS errors in newer @types/react-native */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {itemHeight > 0 && (
        <FlatList
          data={reels}
          renderItem={({ item, index }) => (
            <ReelItem
              item={item}
              isActive={isFocused && index === currentIndex}
              height={itemHeight}
            />
          )}
          keyExtractor={(item) => item.id}
          pagingEnabled
          snapToInterval={itemHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          removeClippedSubviews={Platform.OS === 'android'} // This prop can cause issues on iOS with video
        />
      )}
    </View>
  );
};

export default ReelsScreen;

const GLASS = 'rgba(120, 120, 120, 0.55)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Removed 'hidden' style as the video should always be visible when active

  bottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    // backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },

  topControls: {
    position: 'absolute',
    left: scale(16),
    right: scale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: GLASS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
    bottom: 50
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },

  leftPanel: {
    position: 'absolute',
    left: scale(16),
    alignItems: 'center',
  },
  ratingPill: {
    width: moderateScale(46),
    backgroundColor: GLASS,
    borderRadius: moderateScale(23),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(12),
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  starSmall: {
    width: moderateScale(13),
    height: moderateScale(13),
    tintColor: '#fff',
    marginVertical: verticalScale(3),
  },
  starEmpty: {
    opacity: 0.35,
  },
  ratingText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(13),
    marginTop: verticalScale(8),
  },
  datePillWrapper: {
    width: moderateScale(46),
    height: moderateScale(128),
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePill: {
    width: moderateScale(128),
    height: moderateScale(46),
    backgroundColor: GLASS,
    borderRadius: moderateScale(23),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-90deg' }],
  },
  dateText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
  },

  rightPanel: {
    position: 'absolute',
    right: scale(16),
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  actionCircle: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: GLASS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  actionPlain: {
    width: moderateScale(46),
    height: moderateScale(46),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  bookmarkCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  actionText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(11),
  },
  divider: {
    width: moderateScale(22),
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    marginBottom: verticalScale(14),
  },

  bottomInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(14),
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  avatar: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfoText: {
    marginLeft: scale(10),
    marginRight: scale(16),
  },
  userName: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(16),
  },
  followersText: {
    color: '#ddd',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(11),
    marginTop: -2,
  },
  followButton: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(20),
  },
  followButtonText: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(13),
  },
  caption: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(15),
    marginBottom: verticalScale(12),
  },
  likedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likedByAvatars: {
    flexDirection: 'row',
    marginRight: scale(8),
  },
  smallAvatar: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  likedByText: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
  },
  followingButtonText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(16),
    color: '#000',
  },
  modalCloseText: {
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(14),
    color: '#333',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    marginRight: scale(12),
  },
  commentBody: {
    flex: 1,
  },
  commentName: {
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(13),
    color: '#000',
  },
  commentTime: {
    fontFamily: 'Poppins-Regular',
    color: '#999',
    fontSize: fontScale(12),
  },
  commentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(14),
    color: '#333',
    marginTop: verticalScale(2),
  },
  commentLikeBtn: {
    padding: scale(8),
  },
  commentInputRow: {
    flexDirection: 'row',
    padding: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  commentInputAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: scale(12),
  },
  commentInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(14),
    color: '#000',
    maxHeight: verticalScale(100),
  },
  sendBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(14),
    color: '#999',
    marginLeft: scale(12),
  },
});