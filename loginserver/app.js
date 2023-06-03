const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// 세션 설정
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tododb',
  clearExpired: true, // 만료된 세션 데이터를 자동으로 삭제
  checkExpirationInterval: 10 * 60 * 1000 // 만료된 세션을 확인하는 주기를 10분으로 설정
});
app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
          maxAge: 60 *60 * 1000 // 쿠키 유효 기간 설정(60분)
        }
    })
);

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tododb',
});
db.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 중 오류 발생:', err.stack);
    return;
  }
  console.log('데이터베이스에 연결되었습니다');
});


//회원가입
app.post('/register', async (req, res) => {
  const { id, username, password, confirmPassword } = req.body;

  if (!id || !username || !password || !confirmPassword) {
    return res.status(400).send('아이디, 사용자 이름, 비밀번호, 비밀번호 재확인을 입력해주세요');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호와 비밀번호 확인이 일치하지 않습니다');
  }

  const checkIdQuery = 'SELECT * FROM users WHERE id = ?';
  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';

  try {
    const [idResults, usernameResults] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(checkIdQuery, [id], (error, results) => {
          if (error) reject('기존 아이디 확인 중 오류 발생');
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(checkUsernameQuery, [username], (error, results) => {
          if (error) reject('기존 사용자 이름 확인 중 오류 발생');
          resolve(results);
        });
      }),
    ]);

    if (idResults.length > 0 && usernameResults.length > 0) {
      return res.status(400).send('이미 사용 중인 아이디와 사용자 이름입니다');
    } else if (idResults.length > 0) {
      return res.status(400).send('이미 사용 중인 아이디입니다');
    } else if (usernameResults.length > 0) {
      return res.status(400).send('이미 사용 중인 사용자 이름입니다');
    }

    const registerQuery = 'INSERT INTO users (id, username, password) VALUES (?, ?, md5(?))';
    db.query(registerQuery, [id, username, password], (error) => {
      if (error) {
        console.log('사용자 등록 중 오류 발생:', error);
        return res.status(500).send('사용자 등록 중 오류 발생');
      }

      res.status(200).send('회원가입이 성공적으로 완료되었습니다');
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});




//로그인
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).send('아이디와 비밀번호를 입력해주세요');
  }

  const checkUserQuery = 'SELECT * FROM users WHERE id = ? AND password = MD5(?)';
  db.query(checkUserQuery, [id, password], (error, results) => {
    if (error || results.length === 0) {
      return res.status(400).send('잘못된 아이디 또는 비밀번호입니다');
    }

    const user = results[0];
    req.session.userId = user.id;
    res.status(200).send('로그인에 성공하였습니다');
  });
});



//로그아웃
app.get('/logout', (req, res) => {
  if (req.session.userId) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send('로그아웃 중 오류가 발생하였습니다');
      }
      res.status(200).send('로그아웃에 성공하였습니다');
    });
  } else {
    res.status(400).send('로그인 상태가 아닙니다');
  }
});









//할일 저장
app.post('/todo', (req, res) => {
  const userId = req.session.userId;
  const { date, todo } = req.body;
  const query = 'INSERT INTO todos (user_id, date, todo) VALUES (?, ?, ?)';
  db.query(query, [userId, date, todo], (error) => {
    if (error) {
      console.error('할 일 저장 중 오류 발생:', error.stack);
      return res.status(500).send('할 일 저장 중 오류 발생');
    }
    res.status(200).send('할 일 저장 성공');
  });
});

//할일 수정
app.put('/todo/:id', (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;
  const { date, todo } = req.body;
  const query = 'UPDATE todos SET todo = ? WHERE id = ? AND user_id = ? AND date = ?';
  db.query(query, [todo, id, userId, date], (error) => {
    if (error) {
      console.error('할 일 수정 중 오류 발생:', error.stack);
      return res.status(500).send('할 일 수정 중 오류 발생');
    }
    res.status(200).send('할 일 수정 성공');
  });
});


//할일 삭제
app.delete('/todo/:id', (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;
  const { date } = req.body;
  const query = 'DELETE FROM todos WHERE id = ? AND user_id = ? AND date = ?';
  db.query(query, [id, userId, date], (error) => {
    if (error) {
      console.error('할 일 삭제 중 오류 발생:', error.stack);
      return res.status(500).send('할 일 삭제 중 오류 발생');
    }
    res.status(200).send('할 일 삭제 성공');
  });
});





//할일 불러오기
app.get('/todo', (req, res) => {
  const userId = req.session.userId;
  const { date } = req.query;
  const query = 'SELECT * FROM todos WHERE user_id = ? AND date = ?';
  db.query(query, [userId, date], (error, results) => {
    if (error) {
      console.error('할 일 불러오기 중 오류 발생:', error.stack);
      return res.status(500).send('할 일 불러오기 중 오류 발생');
    }
    res.status(200).json(results);
  });
});






app.listen(4000, () => {
    console.log('서버가 4000 포트에서 실행중입니다.');
});




