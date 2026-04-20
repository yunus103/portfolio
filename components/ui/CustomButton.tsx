import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  children: ReactNode
}

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:scale-95 shadow-sm',
  outline:
    'border border-primary text-primary hover:bg-primary hover:text-white active:scale-95',
  ghost:
    'text-foreground-muted hover:text-foreground hover:bg-background-secondary active:scale-95',
}

export default function CustomButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-medium text-sm rounded-lg px-5 py-2.5',
        'transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'cursor-pointer',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
