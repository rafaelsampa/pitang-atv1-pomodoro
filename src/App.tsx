import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState<{id: number, text: string, completed: boolean}[]>([]);
  const [input, setInput] = useState("");

  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const handleAdd = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  useEffect(() => {
    let interval: number;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      <section style={{ marginBottom: '2rem', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h2>Pomodoro: {formatTime(seconds)}</h2>
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>
        <button onClick={() => {setSeconds(25 * 60); setIsActive(false)}} style={{ marginLeft: '8px' }}>
          Reset
        </button>
      </section>

      
      <section>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nova tarefa..."
        />
        <button onClick={handleAdd}>Add</button>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li key={todo.id} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
              <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}>x</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;