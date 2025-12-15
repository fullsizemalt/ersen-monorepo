import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Plus, MoreHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

interface Task {
    id: string;
    content: string;
    column: 'todo' | 'doing' | 'done';
}

const KanbanWidget: React.FC<WidgetProps> = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', content: 'Design System', column: 'todo' },
        { id: '2', content: 'API Integration', column: 'doing' },
        { id: '3', content: 'Setup Repo', column: 'done' },
    ]);

    const moveTask = (id: string, direction: 'next' | 'prev') => {
        setTasks(prev => prev.map(t => {
            if (t.id !== id) return t;
            const cols = ['todo', 'doing', 'done'] as const;
            const idx = cols.indexOf(t.column);
            const newIdx = direction === 'next' ? Math.min(idx + 1, 2) : Math.max(idx - 1, 0);
            return { ...t, column: cols[newIdx] };
        }));
    };

    const addTask = (column: 'todo' | 'doing' | 'done') => {
        const content = prompt('Task name:');
        if (content) {
            setTasks(prev => [...prev, { id: Date.now().toString(), content, column }]);
        }
    };

    const columns = ['todo', 'doing', 'done'] as const;

    return (
        <div className="h-full flex flex-col bg-gray-900 p-4 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-300">Kanban Board</h3>
                <button className="text-gray-500 hover:text-white"><MoreHorizontal size={16} /></button>
            </div>

            <div className="flex-1 flex gap-2 overflow-x-auto">
                {columns.map(col => (
                    <div key={col} className="flex-1 min-w-[120px] flex flex-col bg-gray-800/50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase text-gray-400">{col}</span>
                            <button onClick={() => addTask(col)} className="text-gray-500 hover:text-blue-400">
                                <Plus size={14} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {tasks.filter(t => t.column === col).map(task => (
                                <div key={task.id} className="bg-gray-700 p-2 rounded text-sm text-gray-200 group relative">
                                    {task.content}
                                    <div className="absolute top-1 right-1 hidden group-hover:flex bg-gray-800 rounded shadow">
                                        {col !== 'todo' && (
                                            <button onClick={() => moveTask(task.id, 'prev')} className="p-1 hover:text-blue-400">
                                                <ChevronLeft size={12} />
                                            </button>
                                        )}
                                        {col !== 'done' && (
                                            <button onClick={() => moveTask(task.id, 'next')} className="p-1 hover:text-blue-400">
                                                <ChevronRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanWidget;
