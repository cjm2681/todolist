import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import CalendarScreen from './components/CalendarScreen';  // <-- 여기에 CalendarScreen 컴포넌트를 추가합니다.

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Calendar" component={CalendarScreen} /> 
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
