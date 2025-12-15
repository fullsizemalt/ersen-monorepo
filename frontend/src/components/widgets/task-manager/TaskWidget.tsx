import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

const TaskWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [newTask, setNewTask] = useState('');
    const tasks: Task[] = config.tasks || [];

    const updateTasks = (newTasks: Task[]) => {
        onConfigChange({ ...config, tasks: newTasks });
    };

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task: Task = {
            id: Date.now().toString(),
            text: newTask.trim(),
            completed: false,
        };

        updateTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (taskId: string) => {
        updateTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTask = (taskId: string) => {
        updateTasks(tasks.filter(t => t.id !== taskId));
    };

    return (
        <WidgetWrapper title="Tasks">
            <div className="flex flex-col h-full">
                <form onSubmit={addTask} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add task..."
                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="p-1 bg-blue-600 rounded hover:bg-blue-700 text-white"
                    >
                        <Plus size={16} />
                    </button>
                </form>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {tasks.length === 0 && (
                        <div className="text-center text-gray-500 text-xs mt-4">
                            No tasks yet
                        </div>
                    )}

                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="group flex items-center gap-2 text-sm p-1.5 hover:bg-white/5 rounded transition-colors"
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`flex-shrink-0 ${task.completed ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                            </button>

                            <span className={`flex-1 truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default TaskWidget;
