import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';


export default function LoginScreen({ navigation }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
      if (!id || !password) {
        Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.');
        return;
      }
    
      axios
        .post('http://localhost/login', {  //ip넣기
          id,
          password,
        })
        .then((response) => {
          Alert.alert('성공', '로그인에 성공하였습니다.');
          navigation.navigate('Calendar');  // <-- 로그인 성공 후 CalendarScreen으로 이동합니다.
        })
        .catch((error) => {
          if (error.response) {
            Alert.alert('오류', error.response.data);
          } else {
            Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
          }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
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
            <Button title="로그인" onPress={handleLogin} />
            <Button title="회원가입" onPress={() => navigation.navigate('Signup')} />
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
