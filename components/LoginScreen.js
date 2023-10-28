import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  // 상태 변수들
  const [id, setId] = useState(''); // 아이디 입력 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태 관리

  // 로그인 버튼 클릭 시 실행되는 함수
  const handleLogin = () => {
    if (!id || !password) {
      Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.'); // 입력값이 없을 경우 알림창 표시
      return;
    }

    axios
      .post('http://localhost:4000/login', {
        id,
        password,
      })
      .then((response) => {
        Alert.alert('성공', response.data); // 로그인 성공 시 알림창 표시
        navigation.navigate('Calendar'); // Calendar 화면으로 이동
      })
      .catch((error) => {
        if (error.response) {
          Alert.alert('오류', error.response.data); // 서버에서 에러 응답이 온 경우 알림창 표시
        } else {
          Alert.alert('오류', '로그인 중 오류가 발생했습니다.'); // 그 외의 경우 일반 오류 알림창 표시
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>환영합니다!</Text>
      <TextInput
        value={id}
        onChangeText={setId}
        placeholder="아이디"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="로그인" onPress={handleLogin} color="#ff8c00" style={styles.button} />
        <Button title="회원가입" onPress={() => navigation.navigate('Signup')} color="#ff8c00" style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffe4b5',
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#ff4500',
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#ffa07a',
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#fffafa',
  },
  buttonContainer: {
    width: '80%', // 전체 비율에 맞게 조정
  },
  button: {
    marginBottom: 10,
  }
});
