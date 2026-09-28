import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import { Icons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../components/common/Toast';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  
  // Get all registered users from our persisted Redux state
  const registeredUsers = useSelector((state: RootState) => state.auth.registeredUsers);

  const handleLogin = () => {
    if (!email) {
      showToast('error', 'Please enter your email address');
      return;
    }
    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      showToast('error', 'Please enter your password');
      return;
    }
    
    // Check if the user exists in our local Redux "database" with matching credentials
    const user = registeredUsers.find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );

    if (user) {
      showToast('success', 'Logged in successfully!');
      
      setTimeout(() => {
        // Log them in without saving password in the active session
        dispatch(loginSuccess({ email: user.email, name: user.name }));
      }, 800);
    } else {
      showToast('error', 'Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>
            <Image source={Icons.reel} style={styles.icon} resizeMode="contain" />
          </View>
          <Text style={styles.title}>SnapReel</Text>
          <Text style={styles.subtitle}>Share moments. Hide photos.</Text>
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>
        </View>



        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F5F5F5',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  loginBtn: {
    backgroundColor: '#111',
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  orText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 15,
  },
  socialBtn: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  socialBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomText: {
    color: '#666',
    fontSize: 14,
  },
  signupText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
