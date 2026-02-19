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

const UNCHECK_MESSAGES = [
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

const DELETE_UNCHECKED_MESSAGES = [
  "Deleting unfinished work? That's one way to clear your conscience, I guess.",
  "If you delete it, it never existed, right? That's definitely how life works.",
  "Running away from your responsibilities... literally deleting them. Impressive.",
  "Some people face their challenges. You just... delete them. Interesting approach.",
  "Out of sight, out of mind. And out of your to-do list. Problem solved!",
  "Why finish tasks when you can just make them disappear? Genius.",
  "I see you've discovered the 'delete' solution to productivity. Revolutionary.",
  "Deleting incomplete tasks: because pretending they never existed is easier than doing them.",
  "Nothing says 'I've got this' quite like deleting things you haven't done.",
  "Your problem-solving skills are... unique. Delete first, regret later?",
  "Ah yes, the classic 'if I delete it, I never failed' strategy.",
  "Some people complete tasks. You delete them. Both end with the task gone, right?",
  "Deleting your to-dos before doing them. That's thinking outside the box!",
  "Why do work when you can just delete the evidence? Brilliant.",
  "I admire your commitment to avoiding commitment... by deleting it entirely.",
];

const INSTANT_CHECK_MESSAGES = [
  "Did you actually do that? Or are you just checking boxes for fun?",
  "Wow, that was fast! Almost suspiciously fast... 🤔",
  "Already done? Sure. I totally believe you. Definitely.",
  "That took you what, 2 seconds? You must be incredibly efficient. Or creative.",
  "I'm impressed by your speed. And by 'impressed' I mean 'skeptical.'",
  "Checking it off immediately? Bold move. Very bold. Very... questionable.",
  "Either you're the fastest worker alive, or you're gaming the system. Which is it?",
  "That was quick! Too quick. Suspiciously quick. But hey, who am I to judge?",
  "Did you do it, or did you just decide it was done? There's a difference.",
  "Instant completion! It's almost like you didn't actually do anything at all.",
  "Some people do tasks. You apparently just think about them and they're done. Magic!",
  "That speed is remarkable. Almost like you just wanted to see it checked off...",
  "Already finished? Or did you just realize you didn't need to do it? Be honest.",
  "Wow, you work fast! Or... you check boxes fast. One of those.",
  "I see you're speedrunning your to-do list. By skipping the 'do' part.",
];

interface PassiveAggressiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'uncheck' | 'delete-unchecked' | 'instant-check';
}

export function PassiveAggressiveModal({ 
  open, 
  onOpenChange, 
  variant = 'uncheck' 
}: PassiveAggressiveModalProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open) {
      let messages: string[];
      switch (variant) {
        case 'delete-unchecked':
          messages = DELETE_UNCHECKED_MESSAGES;
          break;
        case 'instant-check':
          messages = INSTANT_CHECK_MESSAGES;
          break;
        default:
          messages = UNCHECK_MESSAGES;
      }
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage);
    }
  }, [open, variant]);

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
