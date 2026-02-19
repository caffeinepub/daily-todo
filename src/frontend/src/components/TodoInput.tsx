import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAddTask } from '../hooks/useQueries';

export function TodoInput() {
  const [text, setText] = useState('');
  const addTask = useAddTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTask.mutate(text.trim(), {
        onSuccess: () => {
          setText('');
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
        disabled={addTask.isPending}
      />
      <Button type="submit" disabled={addTask.isPending || !text.trim()}>
        {addTask.isPending ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <Plus className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
