import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Pressable,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { X, Volume2, VolumeX } from 'lucide-react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');
const HOLD_DELAY = 200;

const StoryScreen = () => {
    const { myStories } = useSelector((state: RootState) => state.app);
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [muted, setMuted] = useState(false);

    const progress = useRef(new Animated.Value(0)).current;
    const progressValue = useRef(0);
    const durationRef = useRef(5000);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHolding = useRef(false);

    useEffect(() => {
        const id = progress.addListener(({ value }) => {
            progressValue.current = value;
        });
        return () => {
            progress.removeListener(id);
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, [progress]);

    useEffect(() => {
        setPaused(false);
        isHolding.current = false;
        if (myStories.length > 0) {
            const currentStory = myStories[currentIndex];
            if (currentStory.mediaType === 'photo') {
                startProgress(5000);
            } else {
                progress.stopAnimation();
                progress.setValue(0);
            }
        }
    }, [currentIndex, myStories]);

    const runAnimation = (duration: number) => {
        Animated.timing(progress, {
            toValue: 1,
            duration,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                nextStory();
            }
        });
    };

    const startProgress = (duration: number) => {
        durationRef.current = duration;
        progress.setValue(0);
        runAnimation(duration);
    };

    const pauseStory = () => {
        progress.stopAnimation();
        setPaused(true);
    };

    const resumeStory = () => {
        setPaused(false);
        const remaining = durationRef.current * (1 - progressValue.current);
        if (remaining > 0) {
            runAnimation(remaining);
        }
    };

    const nextStory = () => {
        if (currentIndex < myStories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            navigation.goBack();
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const toggleMute = () => {
        setMuted((prev) => !prev);
    };

    const handlePressIn = () => {
        isHolding.current = false;
        if (holdTimer.current) clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => {
            isHolding.current = true;
            pauseStory();
        }, HOLD_DELAY);
    };

    const handlePressOut = (onTap: () => void) => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        if (isHolding.current) {
            isHolding.current = false;
            resumeStory();
        } else {
            onTap();
        }
    };

    if (myStories.length === 0) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No stories created yet.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentStory = myStories[currentIndex];
    const isVideo = currentStory.mediaType !== 'photo';

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {!isVideo ? (
                <Image source={{ uri: currentStory.mediaUri }} style={styles.media} />
            ) : (
                <Video
                    key={currentStory.id}
                    source={{ uri: currentStory.mediaUri }}
                    style={styles.media}
                    resizeMode="cover"
                    paused={paused}
                    muted={muted}
                    onLoad={(data) => {
                        startProgress(data.duration * 1000);
                    }}
                    onEnd={nextStory}
                />
            )}

            <View style={styles.topContainer}>
                <View style={styles.progressBarContainer}>
                    {myStories.map((s, index) => (
                        <View key={s.id} style={styles.progressTrack}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width:
                                            index === currentIndex
                                                ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                                                : index < currentIndex
                                                    ? '100%'
                                                    : '0%',
                                    },
                                ]}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.headerRow}>
                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.username}>Your Story</Text>
                    </View>

                    <View style={styles.headerActions}>
                        {isVideo && (
                            <TouchableOpacity
                                style={styles.muteButton}
                                onPress={toggleMute}
                                activeOpacity={0.7}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                {muted ? (
                                    <VolumeX color="#fff" size={24} />
                                ) : (
                                    <Volume2 color="#fff" size={24} />
                                )}
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <X color="#fff" size={28} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Pressable
                style={styles.leftTouch}
                onPressIn={handlePressIn}
                onPressOut={() => handlePressOut(prevStory)}
            />
            <Pressable
                style={styles.rightTouch}
                onPressIn={handlePressIn}
                onPressOut={() => handlePressOut(nextStory)}
            />

            {currentStory.caption ? (
                <View style={styles.captionContainer} pointerEvents="none">
                    <Text style={styles.captionText}>{currentStory.caption}</Text>
                </View>
            ) : null}
        </View>
    );
};

export default StoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    media: {
        width: width,
        height: height,
        resizeMode: 'cover',
    },
    topContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        zIndex: 10,
    },
    progressBarContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    progressTrack: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 2,
        borderRadius: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    username: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    muteButton: {
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftTouch: {
        position: 'absolute',
        left: 0,
        top: '15%',
        bottom: '20%',
        width: '30%',
        zIndex: 5,
    },
    rightTouch: {
        position: 'absolute',
        right: 0,
        top: '15%',
        bottom: '20%',
        width: '70%',
        zIndex: 5,
    },
    captionContainer: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    captionText: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backText: {
        color: '#000',
        fontFamily: 'Poppins-Medium',
    },
});