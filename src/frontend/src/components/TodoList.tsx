import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetAllTasks, useToggleTask, useUpdateTaskText, useRemoveTask } from '../hooks/useQueries';
import { PassiveAggressiveModal } from './PassiveAggressiveModal';
import { Pencil, Check, X, Trash2 } from 'lucide-react';
import type { Task } from '../backend';
import { useTaskTimestamps } from '../hooks/useTaskTimestamps';

type ModalVariant = 'uncheck' | 'delete-unchecked' | 'instant-check';

export function TodoList() {
  const { data: tasks, isLoading, error } = useGetAllTasks();
  const toggleTask = useToggleTask();
  const updateTaskText = useUpdateTaskText();
  const removeTask = useRemoveTask();
  const { checkIfInstantCheck, clearTimestamp } = useTaskTimestamps();
  
  const [uncheckedTasks, setUncheckedTasks] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<ModalVariant>('uncheck');
  const [previousStates, setPreviousStates] = useState<Map<string, boolean>>(new Map());
  const [editingTaskText, setEditingTaskText] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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

  const handleToggle = async (task: Task) => {
    const wasChecked = previousStates.get(task.text) || false;
    const willBeChecked = !task.checked;

    // If task was checked and is being unchecked
    if (wasChecked && !willBeChecked) {
      setUncheckedTasks((prev) => new Set(prev).add(task.text));
      setModalVariant('uncheck');
      setShowModal(true);
    } else if (!wasChecked && willBeChecked) {
      // Check if this is an instant check-off
      if (checkIfInstantCheck(task.text)) {
        setModalVariant('instant-check');
        setShowModal(true);
        clearTimestamp(task.text);
      }
      
      // Remove from unchecked set when checking again
      setUncheckedTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(task.text);
        return newSet;
      });
    }

    try {
      await toggleTask.mutateAsync(task.text);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = (task: Task) => {
    // If task is unchecked, show roast modal
    if (!task.checked) {
      setTaskToDelete(task.text);
      setModalVariant('delete-unchecked');
      setShowModal(true);
    } else {
      // If task is checked, delete immediately
      removeTask.mutate(task.text);
      clearTimestamp(task.text);
    }
  };

  const handleModalClose = (open: boolean) => {
    setShowModal(open);
    
    // If closing after delete-unchecked modal, proceed with deletion
    if (!open && taskToDelete && modalVariant === 'delete-unchecked') {
      removeTask.mutate(taskToDelete);
      clearTimestamp(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskText(task.text);
    setEditText(task.text);
  };

  const cancelEditing = () => {
    setEditingTaskText(null);
    setEditText('');
  };

  const saveEdit = async (oldText: string) => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== oldText) {
      try {
        await updateTaskText.mutateAsync({ oldText, newText: trimmedText });
        setEditingTaskText(null);
        setEditText('');
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    } else {
      cancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, oldText: string) => {
    if (e.key === 'Enter') {
      saveEdit(oldText);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
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

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p className="text-lg">Failed to load tasks. Please refresh the page.</p>
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
          const isEditing = editingTaskText === task.text;

          return (
            <div
              key={task.text}
              className={`flex items-center gap-3 p-4 bg-card rounded-lg border transition-colors ${
                isEditing
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-accent'
              }`}
            >
              <Checkbox
                checked={task.checked}
                onCheckedChange={() => handleToggle(task)}
                disabled={toggleTask.isPending || isEditing}
                className="flex-shrink-0"
              />
              
              {isEditing ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, task.text)}
                    className="flex-1"
                    autoFocus
                    disabled={updateTaskText.isPending}
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => saveEdit(task.text)}
                      disabled={updateTaskText.isPending}
                      className="h-8 w-8 text-success hover:bg-success/10"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={cancelEditing}
                      disabled={updateTaskText.isPending}
                      className="h-8 w-8 text-muted-foreground hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
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
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEditing(task)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(task)}
                      disabled={removeTask.isPending}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <PassiveAggressiveModal 
        open={showModal} 
        onOpenChange={handleModalClose}
        variant={modalVariant}
      />
    </>
  );
}
