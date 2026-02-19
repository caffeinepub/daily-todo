import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const PASSIVE_AGGRESSIVE_MESSAGES = [
  "Oh, giving up already? That's... totally fine. We all have our limits.",
  "Wow, unchecking tasks. Bold strategy. Let's see how that works out for you.",
  "I'm sure you had a really good reason for that. Really. I believe you.",
  "Nothing says 'productivity' quite like going backwards, right?",
  "Hey, at least you're consistent... at being inconsistent.",
  "I won't judge. Out loud. To your face. Right now.",
  "Some people climb mountains. You uncheck boxes. Both are... choices.",
  "Your work ethic is truly something. I'm just not sure what.",
  "Quitting is just success in reverse. You're doing great!",
  "I admire your commitment to not being committed.",
  "Well, well, well. If it isn't the consequences of your own actions.",
  "Don't worry, I'm sure future you will totally understand.",
  "Procrastination is just planning with extra steps, right?",
  "I see you're taking the scenic route to productivity.",
  "Your dedication to avoiding dedication is actually impressive.",
];

interface PassiveAggressiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PassiveAggressiveModal({ open, onOpenChange }: PassiveAggressiveModalProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open) {
      const randomMessage =
        PASSIVE_AGGRESSIVE_MESSAGES[Math.floor(Math.random() * PASSIVE_AGGRESSIVE_MESSAGES.length)];
      setMessage(randomMessage);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Interesting Choice... 🤔</DialogTitle>
          <DialogDescription className="text-base pt-4 text-foreground/90">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            I'll Do Better... Maybe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
