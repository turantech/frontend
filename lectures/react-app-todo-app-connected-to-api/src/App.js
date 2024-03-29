import { todoApi } from "./api/todo";
import { useEffect, useState } from "react";
import { Form } from "./Form";
import "./App.css";
import { Todos } from "./Todos";

const App = () => {
    const [todos, setTodos] = useState([]);
    const [todoInputValue, setTodoInputValue] = useState("");

    useEffect(() => {
        todoApi
            .getAll()
            .then((response) => {
                setTodos(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleTodoInputChange = (value) => {
        setTodoInputValue(value);
    };

    const createTodo = (e) => {
        e.preventDefault();
        if (todoInputValue.length < 3) {
            return;
        }

        todoApi
            .create(todoInputValue)
            .then((response) => {
                setTodoInputValue("");
                setTodos((prevTodos) => {
                    return [...prevTodos, response.data];
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateStatus = (id, status) => {
        todoApi
            .updateStatus(id, status)
            .then((_) => {
                setTodos((prevTodos) => {
                    /* 
                    const updatedTodos = prevTodos.map((todo) => {
                        if (todo.id === id) {
                            const copy = { ...todo };
                            copy.status = status;
                            return copy;
                        }
                        return todo;
                    });
                    return updatedTodos;
                    */
                    const copyTodos = [];
                    for (let i = 0; i < todos.length; i++) {
                        const todo = todos[i];
                        if (todo.id === id) {
                            const copy = { ...todo };
                            copy.status = status;
                            copyTodos.push(copy);
                        } else {
                            copyTodos.push(todo);
                        }
                    }
                    return copyTodos;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        todoApi
            .deleteOne(id)
            .then(() => {
                setTodos((prevTodos) => {
                    return prevTodos.filter((todo) => todo.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const isSubmitButtonDisabled = !todoInputValue.length;

    return (
        <main>
            <h1>Todo App</h1>

            <Form
                isSubmitButtonDisabled={isSubmitButtonDisabled}
                todoValue={todoInputValue}
                handleTodoValue={handleTodoInputChange}
                createTodo={createTodo}
            />

            <Todos
                todos={todos}
                updateStatus={updateStatus}
                deleteTodo={deleteTodo}
            />
        </main>
    );
};
export default App;
