import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import CalendarScreen from './components/CalendarScreen';

const Stack = createStackNavigator();

function App() {
    return (
        // 네비게이션 컨테이너 설정
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* 로그인 화면 설정 */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'ToDoList' }} // 헤더 타이틀을 'ToDoList'로 변경
                />
                {/* 회원가입 화면 설정 */}
                <Stack.Screen name="Signup" component={SignupScreen} />     
                {/* 캘린더 화면 설정 */}
                <Stack.Screen name="Calendar" component={CalendarScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
