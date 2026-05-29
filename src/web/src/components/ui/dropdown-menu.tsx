'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a DropdownMenu');
  }
  return context;
}

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownMenu({ children, className, ...props }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  const onOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, onOpenChange }}>
      <div className={cn('relative inline-block', className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children, className, asChild, ...props }: DropdownMenuTriggerProps) {
  const { onOpenChange } = useDropdownContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => onOpenChange(true),
    });
  }

  return (
    <button
      type="button"
      className={cn('inline-flex items-center justify-center', className)}
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenuContent({ children, className, align = 'end', ...props }: DropdownMenuContentProps) {
  const { open, onOpenChange } = useDropdownContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md',
        align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0',
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownMenuItem({ children, className, ...props }: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}