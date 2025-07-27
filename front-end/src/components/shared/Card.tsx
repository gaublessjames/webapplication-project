import { BaseComponentProps } from "@/types/common";
import { cn } from "@/lib/utils";

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border border-gray-200 shadow-lg',
  outlined: 'bg-white border-2 border-gray-200',
  flat: 'bg-gray-50 border border-gray-100'
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  ...props
}: CardProps) {
  const baseClasses = cn(
    'rounded-lg transition-all duration-200',
    variantClasses[variant],
    paddingClasses[padding],
    hover && 'hover:shadow-md hover:-translate-y-1',
    clickable && 'cursor-pointer',
    className
  );

  if (clickable || onClick) {
    return (
      <div
        className={baseClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

// Card sub-components for better composition
export function CardHeader({ children, className = '' }: BaseComponentProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: BaseComponentProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: BaseComponentProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: BaseComponentProps) {
  return (
    <div className={cn('flex items-center justify-between pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
} 