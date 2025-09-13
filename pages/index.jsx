import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdConfirmationNumber } from "react-icons/md";
import axios from "axios";
import { format } from "date-fns";
// import "../styles/globals.css";

const index = () => {
  const [editText, setEditText] = useState();
  const [todos, setTodos] = useState([]);
  const [todosCopy, setTodosCopy] = useState(todos);
  const [todoInput, setTodoInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // STATE MANAGEMENT

  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("")

  useEffect(() => {
    // fetchTodos()

  }, [count]);

  const editTodo = (index) => {
    setTodoInput(todos[index].title);
    setEditIndex(index);
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/todos")
      setTodos(response.data)
      setTodosCopy(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addTodo = async () => {

    try {
      if (editIndex === -1) {
        // ADD NEW TODO
        const response = await axios.post("http://127.0.0.1:8080/todos", {
          title: todoInput,
          completed: false,
        });
        setTodos(response.data);
        setTodosCopy(response.data);
        setTodoInput("");
      } else {
        // UPDATE EXISTING TODO
        const todoToUpdate = { ...todos[editIndex], title: todoInput };
        const response = await axios.put(
          `http://127.0.0.1:8080/todos/${todoToUpdate.id}`,
          {
            title: todoToUpdate.title,
            completed: todoToUpdate.completed
          }
        );

        // Use backend response directly
        setTodos(response.data);
        setTodosCopy(response.data);
        setTodoInput("");
        setEditIndex(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
      setTodos(response.data);
      setTodosCopy(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  const toggleCompleted = async (index) => {
    try {
      const todoToUpdate = {
        ...todos[index],
        completed: !todos[index].completed,
      }
      const response = await axios.put(
        `http://127.0.0.1:8080/todos/${todoToUpdate.id}`,
        {
          title: todoToUpdate.title,
          completed: todoToUpdate.completed
        }
      );
      const updatedTodos = [...todos];
      updatedTodos[index];
      setCount(count + 1)
    } catch (error) {
      console.log(error);
    }
  }

  const searchTodo = () => {
    const results = todos.filter((todo) => todo.title.toLowerCase().includes(searchInput.toLocaleLowerCase))
  }

  const formatDate = (dateString) => {
    try {
      const data = new Date(dateString)
      return isNaN(data.getTime()) ? "Invalid Date" : format(data, "yyyy-MM-dd HH:mm:ss")
    } catch (error) {
      console.log(error);
    }
  }

  const onHandleSearch = (value) => {
    const filteredTodo = todos.filter(({ title }) =>
      title.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    if (filteredTodo.length === 0) {
      setTodos(todosCopy);
    } else {
      setTodos(filteredTodo);
    }
  };


  const renderTodos = (todosToRender) => {
    return todosToRender.map((todo, index) => (
      <li key={index} className="li">
        <label htmlFor="" className="form-check-label"></label>
        <span className="todo-text">
          {`${todo.title} ${formatDate(todo.created_at)}`}
        </span>
        <span className="span-button" onClick={() => deleteTodo(todo.id)}><i className="fa-solid fa-trash"><MdDelete /></i></span>
        <span className="span-button" onClick={() => editTodo(index)}><i className="fa-solid fa-trash"><MdEdit /></i></span>
      </li>
    ))
  }

  const onClearSearch = (value) => {
    if (todos.length && todosCopy.length) {
      setTodos(todosCopy)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() =>
      setSearch(searchItem), 1000
    )
    return () => clearTimeout(timer)
  }, [searchItem])

  useEffect(() => {
    if (search) {
      onHandleSearch(search)
    } else {
      onClearSearch()
    }
  }, [search])

  return <div className="main-body">
    <div className="todo-app">
      <div className="input-section">
        <input type="text" id="todoInput" placeholder="Add Items..." value={todoInput} onChange={(e) => setTodoInput(e.target.value)}>
        </input>
        <button onClick={() => addTodo()} className="add">
          {editIndex === -1 ? "ADD TODO" : "UPDATE TODO"}
        </button>
        <input type="text" id="searchInput" placeholder="Search Items..." value={searchItem} onChange={(e) => setSearchItem(e.target.value)}>
        </input>
      </div>
      {/* BODY */}
      <div className="todos">
        <ul className="todo-list">
          {
            renderTodos(todos)
          }
        </ul>
        <ul className="todo-list">
          {
            todos.length === 0 && (
              <div>
                <h1>Nothig found</h1>
              </div>
            )
          }
        </ul>
      </div>
    </div>
  </div>;
};

export default index;