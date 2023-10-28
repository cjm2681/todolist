import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
  // 상태 변수들
  const [id, setId] = useState(''); // 아이디 입력 상태 관리
  const [username, setUsername] = useState(''); // 사용자 이름 입력 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태 관리
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 입력 상태 관리

  // 회원가입 버튼 클릭 시 실행되는 함수
  const handleSignup = () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.'); // 비밀번호와 비밀번호 확인이 일치하지 않을 경우 알림창 표시
      return;
    }

    axios.post('http://localhost:4000/register', {
      id,
      username,
      password,
      confirmPassword,
    })
      .then((response) => {
        Alert.alert('성공', '회원가입이 성공적으로 완료되었습니다.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }, // OK 버튼 클릭 시 로그인 화면으로 이동
        ]);
      })
      .catch((error) => {
        if (error.response) {
          Alert.alert('오류', error.response.data); // 서버에서 에러 응답이 온 경우 알림창 표시
        } else {
          Alert.alert('오류', '회원가입 중 오류가 발생했습니다.'); // 그 외의 경우 일반 오류 알림창 표시
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        value={id}
        onChangeText={setId}
        placeholder="아이디"
        style={styles.input}
      />
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="사용자 이름"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="비밀번호 확인"
        secureTextEntry
        style={styles.input}
      />
      <Button title="회원가입" onPress={handleSignup} color="#ff8c00" />
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
    marginBottom: 20,
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
});
