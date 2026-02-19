import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { DarkModeToggle } from './components/DarkModeToggle';
import { CheckSquare } from 'lucide-react';

function App() {
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'daily-todo'
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2 relative">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Daily Todo</h1>
            <div className="absolute right-0">
              <DarkModeToggle />
            </div>
          </div>
          <p className="text-muted-foreground">
            Stay organized, one task at a time
          </p>
        </header>

        <main className="space-y-6">
          <section className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <TodoInput />
          </section>

          <section>
            <TodoList />
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
