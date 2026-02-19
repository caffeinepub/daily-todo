import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetAllTasks, useToggleTask } from '../hooks/useQueries';
import { PassiveAggressiveModal } from './PassiveAggressiveModal';
import type { Task } from '../backend';

export function TodoList() {
  const { data: tasks, isLoading } = useGetAllTasks();
  const toggleTask = useToggleTask();
  const [uncheckedTasks, setUncheckedTasks] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [previousStates, setPreviousStates] = useState<Map<string, boolean>>(new Map());

  // Track previous states
  useEffect(() => {
    if (tasks) {
      const newStates = new Map<string, boolean>();
      tasks.forEach((task) => {
        newStates.set(task.text, task.checked);
      });
      setPreviousStates(newStates);
    }
  }, [tasks]);

  const handleToggle = (task: Task) => {
    const wasChecked = previousStates.get(task.text) || false;
    const willBeChecked = !task.checked;

    // If task was checked and is being unchecked
    if (wasChecked && !willBeChecked) {
      setUncheckedTasks((prev) => new Set(prev).add(task.text));
      setShowModal(true);
    } else if (!wasChecked && willBeChecked) {
      // Remove from unchecked set when checking again
      setUncheckedTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(task.text);
        return newSet;
      });
    }

    toggleTask.mutate(task.text);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-lg animate-pulse">
            <div className="h-5 w-5 bg-muted rounded" />
            <div className="h-4 bg-muted rounded flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No tasks yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => {
          const isUnchecked = uncheckedTasks.has(task.text);
          return (
            <div
              key={task.text}
              className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent transition-colors"
            >
              <Checkbox
                checked={task.checked}
                onCheckedChange={() => handleToggle(task)}
                disabled={toggleTask.isPending}
                className="flex-shrink-0"
              />
              <span
                className={`flex-1 transition-all ${
                  task.checked
                    ? 'line-through text-muted-foreground'
                    : isUnchecked
                    ? 'text-destructive font-medium'
                    : 'text-foreground'
                }`}
              >
                {task.text}
              </span>
            </div>
          );
        })}
      </div>
      <PassiveAggressiveModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
