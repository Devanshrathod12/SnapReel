import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { addStory } from '../../redux/slices/appSlice';
import { showToast } from '../../components/common/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Image as ImageIcon,
  Camera,
  Video,
  MapPin,
  Users,
  Lock,
  MessageSquare,
} from 'lucide-react-native';
import { scale, verticalScale, moderateScale, fontScale } from '../../styles/responsive';

const YELLOW = '#F8B81C';
const MAX_CAPTION = 500;
const HASHTAGS = ['#travel', '#lifestyle', '#food', '#music', '#fitness'];

type Source = 'Gallery' | 'Camera' | 'Video';

const SOURCES: { key: Source; label: string; Icon: any }[] = [
  { key: 'Gallery', label: 'Gallery', Icon: ImageIcon },
  { key: 'Camera', label: 'Camera', Icon: Camera },
  { key: 'Video', label: 'Video', Icon: Video },
];

const CreatePostScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [source, setSource] = useState<Source>('Gallery');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [caption, setCaption] = useState('');
  const [audience, setAudience] = useState<'Public' | 'Private'>('Public');
  const [allowComments, setAllowComments] = useState(true);

  const handleMediaPicker = async () => {
    try {
      const options: any = {
        mediaType: source === 'Video' ? 'video' : 'photo',
        quality: 0.8,
        videoQuality: 'high',
      };
  
      let result: ImagePickerResponse;
      if (source === 'Camera') {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }
  
      if (result.errorMessage) {
        showToast('error', result.errorMessage);
        return;
      }
  
      if (result.assets && result.assets.length > 0) {
        setMediaUri(result.assets[0].uri || null);
        setMediaType(result.assets[0].type?.includes('video') ? 'video' : 'photo');
      }
    } catch (error: any) {
      showToast('error', 'Failed to open media picker');
    }
  };

  const handlePublish = () => {
    if (!mediaUri) {
      showToast('error', 'Please select a photo or video first');
      return;
    }
    
    dispatch(
      addStory({
        id: Date.now().toString(),
        mediaUri,
        mediaType: mediaType || 'photo',
        caption,
        audience,
        allowComments,
        createdAt: Date.now(),
      })
    );
    showToast('success', 'Post created successfully!');
    
    // Reset all fields
    setMediaUri(null);
    setMediaType(null);
    setCaption('');
    setAudience('Public');
    setAllowComments(true);
    setSource('Gallery');
    
    navigation.goBack();
  };

  const addHashtag = (tag: string) => {
    const next = caption.length === 0 ? tag : `${caption.trimEnd()} ${tag}`;
    if (next.length <= MAX_CAPTION) setCaption(next);
  };

  const toggleAudience = () => {
    setAudience((prev) => (prev === 'Public' ? 'Private' : 'Public'));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#000" size={moderateScale(24)} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Create Post</Text>
          <Text style={styles.subtitle}>Share your moments with SnapReel</Text>
        </View>

        <TouchableOpacity style={styles.draftsButton} activeOpacity={0.7}>
          <Text style={styles.draftsText}>Drafts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={[styles.uploadBox, mediaUri ? styles.uploadBoxFilled : null]} activeOpacity={0.8} onPress={handleMediaPicker}>
          {mediaUri ? (
            <Image source={{ uri: mediaUri }} style={styles.previewMedia} />
          ) : (
            <>
              <View style={styles.uploadCircle}>
                <Plus color="#fff" size={moderateScale(22)} strokeWidth={2.5} />
              </View>
              <Text style={styles.uploadTitle}>Add Photos or Videos</Text>
              <Text style={styles.uploadSub}>Tap to select from {source}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.sourceRow}>
          {SOURCES.map(({ key, label, Icon }) => {
            const active = source === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.sourceItem, active && styles.sourceItemActive]}
                onPress={() => setSource(key)}
                activeOpacity={0.8}
              >
                <Icon color="#111" size={moderateScale(20)} strokeWidth={1.8} />
                <Text style={styles.sourceText}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.captionBox}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="#8C8C96"
            multiline
            maxLength={MAX_CAPTION}
            value={caption}
            onChangeText={setCaption}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>
            {caption.length}/{MAX_CAPTION}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsRow}
        >
          {HASHTAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.tagChip}
              onPress={() => addHashtag(tag)}
              activeOpacity={0.8}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.tagPlus} activeOpacity={0.8}>
            <Plus color="#000" size={moderateScale(16)} />
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <MapPin color="#111" size={moderateScale(20)} strokeWidth={1.8} />
            </View>
            <View style={[styles.optionContent, styles.optionBorder]}>
              <Text style={styles.optionLabel}>Add Location</Text>
              <ChevronRight color="#8C8C96" size={moderateScale(17)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Users color="#111" size={moderateScale(20)} strokeWidth={1.8} />
            </View>
            <View style={[styles.optionContent, styles.optionBorder]}>
              <Text style={styles.optionLabel}>Tag People</Text>
              <ChevronRight color="#8C8C96" size={moderateScale(17)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={toggleAudience} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Lock color="#111" size={moderateScale(20)} strokeWidth={1.8} />
            </View>
            <View style={[styles.optionContent, styles.optionBorder]}>
              <Text style={styles.optionLabel}>Audience</Text>
              <View style={styles.optionRight}>
                <Text style={styles.optionValue}>{audience}</Text>
                <ChevronRight color="#8C8C96" size={moderateScale(17)} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <MessageSquare color="#111" size={moderateScale(20)} strokeWidth={1.8} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>Allow Comments</Text>
              <Switch
                value={allowComments}
                onValueChange={setAllowComments}
                trackColor={{ false: '#D8D8DE', true: YELLOW }}
                thumbColor="#fff"
                ios_backgroundColor="#D8D8DE"
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.publishButton, !mediaUri && { opacity: 0.5 }]} activeOpacity={0.9} onPress={handlePublish} disabled={!mediaUri}>
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(12),
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: scale(12),
    top: verticalScale(8),
    width: moderateScale(32),
    height: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(17),
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(11),
    color: '#8C8C96',
    marginTop: verticalScale(1),
  },
  draftsButton: {
    position: 'absolute',
    right: scale(16),
    top: verticalScale(8),
    height: moderateScale(32),
    justifyContent: 'center',
    zIndex: 2,
  },
  draftsText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(13),
    color: YELLOW,
  },

  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(24),
  },

  uploadBox: {
    height: verticalScale(170),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D5D5DB',
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadBoxFilled: {
    borderStyle: 'solid',
    borderWidth: 0,
  },
  previewMedia: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadCircle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  uploadTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(14),
    color: '#000',
  },
  uploadSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(11),
    color: '#8C8C96',
    marginTop: verticalScale(2),
  },

  sourceRow: {
    flexDirection: 'row',
    marginTop: verticalScale(14),
  },
  sourceItem: {
    flex: 1,
    marginHorizontal: scale(5),
    height: verticalScale(60),
    borderRadius: moderateScale(14),
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceItemActive: {
    backgroundColor: '#ECEDFF',
  },
  sourceText: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(11),
    color: '#111',
    marginTop: verticalScale(3),
  },

  captionBox: {
    marginTop: verticalScale(14),
    minHeight: verticalScale(88),
    borderRadius: moderateScale(16),
    backgroundColor: '#F5F5F7',
    paddingHorizontal: scale(14),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(8),
  },
  captionInput: {
    minHeight: verticalScale(48),
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(13),
    color: '#000',
    padding: 0,
  },
  counter: {
    alignSelf: 'flex-end',
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(10),
    color: '#8C8C96',
    marginTop: verticalScale(4),
  },

  tagsRow: {
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  tagChip: {
    height: moderateScale(36),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(18),
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    marginRight: scale(8),
  },
  tagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: fontScale(11),
    color: '#111',
  },
  tagPlus: {
    width: moderateScale(40),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionsCard: {
    marginTop: verticalScale(2),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: '#ECECF0',
    backgroundColor: '#fff',
    paddingHorizontal: scale(14),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(54),
    marginLeft: scale(12),
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ECECF0',
  },
  optionLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(14),
    color: '#000',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: fontScale(12),
    color: '#8C8C96',
    marginRight: scale(4),
  },
  switch: {
    transform: [{ scale: 0.85 }],
  },

  publishButton: {
    marginTop: verticalScale(20),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: fontScale(15),
    color: '#fff',
  },
});