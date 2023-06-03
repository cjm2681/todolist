import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        if (password !== confirmPassword) {
          Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
          return;
        }
      
        axios.post('http://localhost/register', { //ip넣기
          id,
          username,
          password,
          confirmPassword,
        })
          .then((response) => {
            Alert.alert('성공', '회원가입이 성공적으로 완료되었습니다.', [
              { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
          })
          .catch((error) => {
            if (error.response) {
              Alert.alert('오류', error.response.data);
            } else {
              Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
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
            <Button title="회원가입" onPress={handleSignup} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});
