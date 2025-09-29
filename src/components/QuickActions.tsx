import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Languages, Lightbulb, Calculator } from 'lucide-react';

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const actions = [
    {
      icon: BookOpen,
      label: 'Study Help',
      prompt: 'Can you help me study? I need assistance with my homework.',
    },
    {
      icon: Languages,
      label: 'Language Practice',
      prompt: 'I want to practice a new language. Can you help me learn?',
    },
    {
      icon: Lightbulb,
      label: 'Fun Fact',
      prompt: 'Tell me an interesting fun fact!',
    },
    {
      icon: Calculator,
      label: 'Math Help',
      prompt: 'I need help solving a math problem.',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={() => onAction(action.prompt)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
