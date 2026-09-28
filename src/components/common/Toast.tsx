import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error';

interface ToastOptions {
  type: ToastType;
  message: string;
}

let showToastFn: (options: ToastOptions) => void;

export const Toast = () => {
  const [options, setOptions] = useState<ToastOptions>({ type: 'success', message: '' });
  const translateY = useRef(new Animated.Value(-150)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  const hideToast = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  useEffect(() => {
    showToastFn = (newOptions: ToastOptions) => {
      setOptions(newOptions);
      
      // Clear any existing timer so it doesn't close prematurely if called rapidly
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Slide down to be visible right below the status bar
      Animated.spring(translateY, {
        toValue: insets.top > 0 ? insets.top + 10 : 20,
        useNativeDriver: true,
        friction: 8,
      }).start();

      // Automatically hide after 2500ms
      timerRef.current = setTimeout(() => {
        hideToast();
      }, 2500); 
    };
  }, [insets.top, translateY, hideToast]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, options.type === 'error' ? styles.errorBg : styles.successBg]}>
          <Text style={styles.iconText}>{options.type === 'success' ? '✓' : '!'}</Text>
        </View>
        <Text style={styles.message}>{options.message}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeBtn} activeOpacity={0.6}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Exported function that can be called from ANYWHERE in the app
export const showToast = (type: ToastType, message: string) => {
  if (showToastFn) {
    showToastFn({ type, message });
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 99999, // Super high z-index to stay on top of all navigators
  },
  content: {
    backgroundColor: '#1A1A1A', // Deeper, richer premium dark background
    borderRadius: 16, // Modern rounded corners
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // Subtle glass-like border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15, // Softer, more diffuse premium shadow
    elevation: 8,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  successBg: {
    backgroundColor: '#2ECC71', // Sophisticated UI green
  },
  errorBg: {
    backgroundColor: '#E74C3C', // Sophisticated UI red
  },
  iconText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12, // Slightly smaller icon text
  },
  message: {
    flex: 1,
    color: '#F5F5F5',
    fontSize: 13.5, // Slightly smaller text as requested
    fontWeight: '400',
    letterSpacing: 0.3, // Adds a touch of modern typography spacing
  },
  closeBtn: {
    padding: 6,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#666', // More subtle close icon
    fontSize: 14,
    fontWeight: '600',
  },
});
