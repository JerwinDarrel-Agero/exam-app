import './App.css';
import {useState, useEffect} from 'react';
import ReactDOM from "react-dom";

//importing components
import Header from './components/Header'
import Form from './components/Form'
import TodoList from './components/TodoList'


function App() {
  
  const apiUrl = 'http://localhost:3000/api/todo';


  //States
  const [inputText, setInputText] = useState("")
  const [todos, setTodos] = useState([])
  const [status, setStatus] = useState("all");
  const [filteredList, setFilteredList] = useState([])
  const [isEditing, setIsEditing] = useState(null)
  const [isGetting, setIsGetting] = useState(true)
  const [isRefreshed, setIsRefreshed] = useState(false)


  useEffect(() => {
    
    if(isRefreshed === false)
    {
      fetch(apiUrl).then(res => {
        return res.json();
      }).then(r => {
        setTodos(r)
      })


    }
    
  },[isGetting])

  useEffect(() => {
    filterHandler()
  },[todos,status])

  useEffect(() =>{
    removeIsEditing()
  },[todos,status,inputText])

  //Functions
  const filterHandler = () => {
    switch(status){
      case "completed":
        setFilteredList(todos.filter(todo => todo.completed === true))
        break;
      case "uncompleted":
        setFilteredList(todos.filter(todo => todo.completed === false))
        break;
      default:
        setFilteredList(todos);
        break;
    }
  }

  const removeIsEditing = () =>{
    setIsEditing(null);
  }

  const fetchRefresh = () => {
    setIsRefreshed(false)
    setIsGetting(true)
    setIsRefreshed(true)
    setIsGetting(false)
    
  }

  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User Login info
  const database = [
    {
      username: "admin",
      password: "admin1234"
    }
    
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };


  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );


  // JSX code for login form
  const renderForm = (
    <div className="form"> 
      <form onSubmit={handleSubmit}>
      <div className='logheader'>
        <header><b>Log In</b></header>
        </div>
        <div className="user-container">
          <label><b>Username</b></label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="password-container">
          <label><b>Password</b></label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
        <div className='registerbtn'>
          <button>Register</button>
        </div>
        
        <div className='forgotbtn'>
          <button>Forgot Password?</button>
        </div>
        
      </form>
    </div>
  );


  return (
    <div className="App">
      <div className="login-form">
        {isSubmitted ? <div>
      <Header />
      <Form inputText={inputText} setInputText={setInputText} 
      todos={todos} setTodos={setTodos}
      setStatus={setStatus}
      apiUrl={apiUrl}
      fetchRefresh={fetchRefresh}
      />
      <TodoList setTodos={setTodos} todos={todos}
       filteredList={filteredList}
       isEditing={isEditing} setIsEditing={setIsEditing}
       apiUrl = {apiUrl} 
       fetchRefresh={fetchRefresh}
       />

       </div> : renderForm}
    </div>
    </div>


  );
}

export default App;
