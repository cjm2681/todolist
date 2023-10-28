import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Modal, Button, TextInput, Platform, BackHandler, ToastAndroid, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

export default function CalendarScreen({ navigation }) {
  // 상태 변수들
  const [modalVisible, setModalVisible] = useState(false); // 모달 창의 표시 여부
  const [editModalVisible, setEditModalVisible] = useState(false); // 수정 모달 창의 표시 여부
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [todo, setTodo] = useState(''); // 할 일 입력 값
  const [todos, setTodos] = useState([]); // 할 일 목록
  const [editTodoId, setEditTodoId] = useState(null); // 수정할 할 일의 ID
  const [editTodoText, setEditTodoText] = useState(''); // 수정된 할 일 내용
  const doubleBackToExitPressedOnce = useRef(false); // 뒤로가기 버튼 두 번 클릭 시 종료 처리를 위한 Ref

  // 뒤로가기 버튼 핸들링을 위한 이벤트 리스너 등록
  useEffect(() => {
    const handleBackPress = () => {
      if (doubleBackToExitPressedOnce.current) {
        BackHandler.exitApp(); // 앱 종료
        return true;
      }

      doubleBackToExitPressedOnce.current = true;
      setTimeout(() => {
        doubleBackToExitPressedOnce.current = false;
      }, 2000); // 2초 내에 다시 누르면 종료 안됨

      ToastAndroid.show('한 번 더 누르면 종료됩니다', ToastAndroid.SHORT); // ToastAndroid로 메시지 표시

      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress); // 뒤로가기 버튼 이벤트 리스너 등록

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress); // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    };
  }, []);

  // 안드로이드에서 뒤로가기 버튼 숨기기
  useEffect(() => {
    if (Platform.OS === 'android') {
      navigation.setOptions({
        headerLeft: null,
      });
    }
  }, [navigation]);

  // 날짜를 선택했을 때 호출되는 함수
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); // 선택한 날짜 설정
    loadTodos(day.dateString); // 선택한 날짜에 해당하는 할 일들 불러오기
    setModalVisible(true); // 모달 열기
  }

  // 할 일 저장 처리
  const handleSave = () => {
    axios.post('http://localhost:4000/todo', {
      date: selectedDate, // 선택한 날짜
      todo: todo, // 입력한 할 일
    }).then(() => {
      loadTodos(selectedDate); // 할 일 목록 다시 불러오기
      setModalVisible(false); // 모달 닫기
      setTodo(''); // 입력 필드 초기화
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  // 할 일 수정 처리
  const handleUpdate = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditTodoText(todoToEdit.todo);
    setEditTodoId(id);
    setEditModalVisible(true);
  }

  // 수정된 할 일 저장 처리
  const handleEditSave = () => {
    axios.put(`http://localhost:4000/todo/${editTodoId}`, {   //ip넢기
      date: selectedDate,
      todo: editTodoText,
    }).then(() => {
      loadTodos(selectedDate);
      setEditModalVisible(false);
      setEditTodoText('');
      setEditTodoId(null);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  // 할 일 삭제 처리
  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/todo/${id}`, {
      data: {
        date: selectedDate,
      },
    }).then(() => {
      loadTodos(selectedDate);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  // 선택한 날짜에 해당하는 할 일들을 불러오는 함수
  const loadTodos = (date) => {
    axios.get('http://localhost:4000/todo', {
      params: {
        date: date,
      },
    }).then(response => {
      setTodos(response.data);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  // 5년 뒤의 날짜 계산
  let fiveYearsLater = new Date();
  fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
  const maxDate = fiveYearsLater.toISOString().split('T')[0];

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert(
      "로그아웃 확인",
      "로그아웃 하시겠습니까?",
      [
        {
          text: "예",
          onPress: () => {
            axios.get('http://localhost:4000/logout')
              .then((response) => {
                if (response.status === 200) {
                  navigation.navigate('Login'); // 로그인 화면으로 이동
                } else {
                  Alert.alert("로그아웃 실패", response.data); // 로그아웃 실패 메시지 표시
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          },
        },
        {
          text: "아니오",
          style: "cancel",
        },
      ]
    );
  }

  // 안드로이드에서 헤더에 로그아웃 버튼 추가
  useEffect(() => {
    if (Platform.OS === 'android') {
      navigation.setOptions({
        headerRight: () => (
          <Button title="로그아웃" onPress={handleLogout} /> // 로그아웃 버튼 추가
        ),
      });
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO LIST 캘린더</Text>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        minDate={'2022-10-10'}
        maxDate={maxDate}
        onDayPress={handleDayPress}
        monthFormat={'yyyy MM'}
        hideArrows={false}
        hideExtraDays={false}
        staticHeader={false}
        enableSwipeMonths={true}
      />

      {/* 할 일 입력 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>할 일을 입력하세요</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTodo}
              value={todo}
              placeholder="예: 숙제하기"
            />
            <Button
              onPress={handleSave}
              title="저장"
              color="#2196F3"
            />

            {todos.map(todo => (
              // 할 일 목록 출력
              <View key={todo.id} style={styles.todoContainer}>
                <Text style={styles.todoText}>{todo.todo}</Text>
                <View style={styles.buttonsContainer}>
                  <Button title="수정" onPress={() => handleUpdate(todo.id)} />
                  <Button title="삭제" onPress={() => handleDelete(todo.id)} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      {/* 할 일 수정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>수정할 일을 입력하세요</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEditTodoText}
              value={editTodoText}
            />
            <Button
              onPress={handleEditSave}
              title="저장"
              color="#2196F3"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fffafa',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#ff4500',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ffa07a',
    backgroundColor: '#fffafa',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 7,
    borderRadius: 7
  },
  todoText: {
    flex: 3,
    fontSize: 16,
  },
  buttonsContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
