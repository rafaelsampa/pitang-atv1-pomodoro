import { useState, useEffect } from "react";

// poderia virar um arquivo separado depois
type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function App() {
  // lista de tarefas
  const [todos, setTodos] = useState<Todo[]>([]);

  // input da tarefa
  const [text, setText] = useState("");

  // pomodoro (25 min)
  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  // adiciona nova tarefa
  function addTodo() {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      done: false,
    };

    setTodos(prev => [...prev, newTodo]);
    setText("");
  }

  // alterna tarefa concluída
  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  // remove tarefa
  function removeTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  // timer
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  }

  function resetTimer() {
    setRunning(false);
    setTime(1500);
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      
      {/* Pomodoro */}
      <div style={{ marginBottom: 20 }}>
        <h2>Pomodoro: {formatTime(time)}</h2>

        <button onClick={() => setRunning(r => !r)}>
          {running ? "Pausar" : "Iniciar"}
        </button>

        <button onClick={resetTimer} style={{ marginLeft: 8 }}>
          Reset
        </button>
      </div>

      {/* Lista de tarefas */}
      <div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nova tarefa..."
          onKeyDown={e => {
            if (e.key === "Enter") addTodo();
          }}
        />

        <button onClick={addTodo}>Add</button>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map(todo => (
            <li key={todo.id} style={{ marginTop: 10 }}>
              
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />

              <span
                style={{
                  marginLeft: 8,
                  textDecoration: todo.done ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>

              <button
                onClick={() => removeTodo(todo.id)}
                style={{ marginLeft: 10 }}
              >
                x
              </button>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}