import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "@firebase/auth";
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyBUPq4I8JXeKlGaO4WuzwX3oQcWHpS3enY",
  authDomain: "examen2-d7784.firebaseapp.com",
  projectId: "examen2-d7784",
  storageBucket: "examen2-d7784.appspot.com",
  messagingSenderId: "1097580104224",
  appId: "1:1097580104224:web:7657bfce02adaf5f8b0a45",
  measurementId: "G-BX4FHKLSV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const AuthScreen = ({email,setEmail, password,setPassword, isLogin,setIsLogin, handleAuthentication}) => {
  return(
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In': 'Sign Up'}</Text>
      <TextInput 
      style={styles.input}
      value={email}
      onChangeText={setEmail}
      placeholder="Email"
      autoCapitalize="none"
      />
      <TextInput 
      style={styles.input}
      value={password}
      onChangeText={setPassword}
      placeholder="Password"
      secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In': 'Sign Up'} 
        color='#3498db'
        onPress={handleAuthentication} 
        
        />
      </View>

      <View style={styles.buttonContainer} >
        <Text style={styles.buttonContainer} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up': 'Already have an account? Sign In'}
        </Text>
      </View>

    </View>
  );
}

const AuthenticatedScreen = ({user,handleAuthentication}) =>{
  return(
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="LogOut" onPress={handleAuthentication} color="#e74c3c"></Button>
    </View>
  );
}

export default function App() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [user,setUser] = useState(null);
  const [isLogin,setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() =>{
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      setUser(user);
    });
    return ()=>unsubscribe();
  },[auth]);

  const handleAuthentication = async ()=>{
    try {
      if (user) {
        console.log('User logged');
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User Signed succesfully');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created succesfully');
        }
      }
    } catch (error) {
      console.error('Autentication error: ', error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ): (
        <AuthScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleAuthentication={handleAuthentication}
        />
      )}
      <StatusBar style='auto' />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
