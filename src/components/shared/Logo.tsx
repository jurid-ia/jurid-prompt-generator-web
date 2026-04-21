import { cn } from '@/lib/utils/cn'

interface LogoProps {
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  theme?: 'light' | 'dark'
  className?: string
}

const sizes = {
  sm: { img: 'h-8', icon: 'h-8 w-8' },
  md: { img: 'h-10', icon: 'h-10 w-10' },
  lg: { img: 'h-14', icon: 'h-14 w-14' },
}

export default function Logo({ variant = 'full', size = 'md', theme = 'light', className }: LogoProps) {
  const s = sizes[size]

  if (variant === 'icon') {
    return (
      <div className={cn('shrink-0', className)}>
        <img
          src={theme === 'dark' ? '/images/logo/iconWhite.png' : '/images/logo/logo.png'}
          alt="Jurid IA"
          className={cn(s.icon, 'object-contain')}
        />
      </div>
    )
  }

  return (
    <div className={cn('shrink-0 flex items-center gap-2', className)}>
      <img
        src={theme === 'dark' ? '/images/logo/logoWhite.png' : '/images/logo/logoBlack.png'}
        alt="Jurid IA — Melhor Amiga do Advogado"
        className={cn(s.img, 'w-auto object-contain')}
      />
    </div>
  )
}
