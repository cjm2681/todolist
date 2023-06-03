import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, Button, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

export default function CalendarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    loadTodos(day.dateString);
    setModalVisible(true);
  }

  const handleSave = () => {
    axios.post('http://localhost/todo', { //ip넣기
      date: selectedDate,
      todo: todo,
    }).then(() => {
      loadTodos(selectedDate);
      setModalVisible(false);
      setTodo('');
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  const handleUpdate = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditTodoText(todoToEdit.todo);
    setEditTodoId(id);
    setEditModalVisible(true);
  }

  const handleEditSave = () => {
    axios.put(`http://localhost/todo/${editTodoId}`, { //ip넣기
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

  const handleDelete = (id) => {
    axios.delete(`http://localhost/todo/${id}`, {  //ip넣기
      data: {
        date: selectedDate,
      },
    }).then(() => {
      loadTodos(selectedDate);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  const loadTodos = (date) => {
    axios.get('http://localhost/todo', { //ip넣기
      params: {
        date: date,
      },
    }).then(response => {
      setTodos(response.data);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  let fiveYearsLater = new Date();
  fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
  const maxDate = fiveYearsLater.toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO LIST 캘린더</Text>
      <Calendar
        
        current={new Date().toISOString().split('T')[0]}
        minDate={'2022-05-10'}
        maxDate={maxDate}
        onDayPress={handleDayPress}
        monthFormat={'yyyy MM'}
        hideArrows={false}
        hideExtraDays={false}
        staticHeader={false}
        enableSwipeMonths={true}
      />

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
              placeholder="예: 쇼핑하기"
            />
            <Button
              onPress={handleSave}
              title="저장"
              color="#2196F3"
            />

            {todos.map(todo => (
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  todoText: {
    flex: 3,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
});


