"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@nakshatra/ui';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden text-sm sm:inline">{isDark ? 'Light' : 'Dark'} mode</span>
    </Button>
  );
};
