import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { ThemeState } from '../state/store';
import Menu from './Menu';
import Settings from './Settings';

if(outputs){
  Amplify.configure(outputs);
}

const client = generateClient<Schema>();

function ToDo() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);
  

  function createTodo() {
    const newToDo = window.prompt("Todo content");
    if(newToDo){
      client.models.Todo.create({ content: [newToDo] }); //false alarm intellisense error
    }
  }

  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);

  return (
    <main className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight todoMain' : 'darkTheme fullWidthFulllHeight todoMain'} >
      <Menu currentTheme={currentTheme}/>
      <Settings />
      <br/>
      <br/>
      <h1 className="center largeText">My to-do list:</h1>
      <button className={currentTheme == 'light' ? 'lightTheme todoButton' : 'darkTheme todoButton'} onClick={createTodo}>+ new</button>
      <ul className="todoUl">
        {todos.map((todo) => (
          <li className="todoLi" key={todo.id}>{ todo.content?.replace(/[\[\]]/g, "") }</li>
        ))}
      </ul>
      {/* <div>
        Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div> */}
    </main>
  );
}

export default ToDo;
