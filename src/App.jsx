import { useState, useEffect } from 'react'
import {motion, AnimatePresence} from 'motion/react'
import './App.css'

const TrashBinSolid = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" fillRule="evenodd" d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4M10 6h4V4h-4zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0z" clipRule="evenodd"></path>
</svg>
    )
function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [counter, setCounter] = useState(0)
  const [taskCount, setTaskCount] = useState(0)
  const [filter, setFilter] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)
  const [theme, setTheme] = useState('dark')

  const handleAddTask = (event) => {
    if (event.key && event.key !== 'Enter') return;
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    }
    setTasks([...tasks, newTask])
    setTask('')
  }
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((t) => 
      t.id === id ? {...t, completed: !t.completed} : t
      )
    )
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })
  
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'))
    if (savedTasks){
      setTasks(savedTasks)
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [isLoaded, tasks])

  useEffect(() => {
    setTaskCount(tasks.length)
    setCounter(tasks.filter(t => t.completed).length)
  }, [tasks])

  const bgColor = theme === 'dark' ? 'bg-gray-900':'bg-gray-100'
  const textColor = theme === 'dark' ? 'text-white':'text-gray-900'

  return (
    <>
      <div class= {`min-h-screen flex flex-col items-center p-6 transition-colors duration-300 ${bgColor} ${textColor}`}>
        <div class= 'flex gap-6'>
          <h1 class= "text-3xl font-bold text-indigo-400 [text-shadow:0_0_8px_rgba(255,255,255,0.3)] mb-6">My Todo App</h1>
        <button
          onClick = {() => setTheme(theme === 'dark' ? 'light': 'dark')}
          class= 'w-10 h-10 flex items-center justify-center px-3 py-2 rounded-full mb-6 bg-indigo-500 text-white hover:bg-indigo-600 transition'>
          {theme === 'dark' ? '☀︎': '☽'}
        </button>
        </div>
        
        <div class= 'flex flex-col sm:flex-row gap-2 w-full max-w-md'>
          <input 
          type="text" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleAddTask}
          placeholder='Enter a task...'
          class= {`flex-1 border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${
            theme === 'dark'
            ?'bg-gray-800 border-gray-700 text-white'
            :'bg-gray-100 border-gray-300 text-gray-900'
          }`}
          />
          <button
          onClick={handleAddTask}
          class= 'bg-indigo-600 px-4 py-2 mb-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors'>
            Add
          </button>
        </div>
        
        <div class= 'grid grid-cols-3 gap-6 mt-6 mb-6 w-full max-w-md'>
          {['all', 'active', 'completed'].map((f) => (
            <button
            key= {f}
            onClick={() => setFilter(f)}
            class= {`flex items-center justify-center px-3 py-1 rounded-lg border transition${
              filter === f ? ' text-gray-300': ' text-gray-700 hover:bg-indigo-600/30 hover:shadow-md hover:shadow-indigo-500/30'
            }`}
            >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
          ))}
        </div>
        <ul class= 'w-full max-w-md'>
          <AnimatePresence>
            {filteredTasks.map((t) => (
            <motion.li
            key={t.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, x: 50}}
            transition={{duration: 0.20}}
            class={`flex justify-between items-center p-3 mb-2 rounded-lg border shadow-sm transition-all${
              t.completed 
              ? theme === 'dark' 
                ? ' bg-green-700 text-gray-200 line-through opacity-70': ' bg-green-200 text-gray-900 line-through opacity-70'
              : theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-800 text-gray-700': 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <span 
                onClick={() => handleToggleTask(t.id)}
                class= 'cursor-pointer flex-1'>
                  {t.text}
                </span>
                <button
                onClick={() => handleDeleteTask(t.id)}
                class= 'ml-2'
                >
                  <TrashBinSolid className="w-6 h-6 text-indigo-400 hover:text-indigo-300 hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.7)] transition" />
                </button> 
            </motion.li>
          ))}
          </AnimatePresence> 
        </ul>
        <p class= 'text-gray-500 font-bold text-xl ml-10 mb-2'>
            {counter} of {taskCount} tasks completed
        </p>
      </div>
    </>
  )
}

export default App