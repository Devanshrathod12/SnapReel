import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, registerUser } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import { Icons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../components/common/Toast';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  
  // Get all registered users to check if the email is already in use
  const registeredUsers = useSelector((state: RootState) => state.auth.registeredUsers);

  const handleRegister = () => {
    if (!name.trim()) {
      showToast('error', 'Please enter your full name');
      return;
    }
    
    if (name.trim().length < 3) {
      showToast('error', 'Name must be at least 3 characters long');
      return;
    }

    if (!email) {
      showToast('error', 'Please enter an email address');
      return;
    }
    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      showToast('error', 'Please create a password');
      return;
    }

    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }
    
    if (!confirmPassword) {
      showToast('error', 'Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match!');
      return;
    }
    
    // Check if the user is already registered in our Redux "database"
    const existingUser = registeredUsers.find(u => u.email === email.toLowerCase().trim());
    if (existingUser) {
      showToast('error', 'This email is already registered. Please log in.');
      return;
    }
    
    // Save the user to the database
    dispatch(registerUser({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password 
    }));
    
    showToast('success', 'Account created successfully!');
    
    setTimeout(() => {
      // Log them into the active session without storing password
      dispatch(loginSuccess({ email: email.toLowerCase().trim(), name: name.trim() }));
    }, 800);
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
          <Text style={styles.title}>Join SnapReel</Text>
          <Text style={styles.subtitle}>Create an account to start sharing.</Text>
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleRegister} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.signupText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
