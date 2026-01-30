import Image from "next/image";

interface ToolIconProps {
  icon?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: { container: 'w-8 h-8', text: 'text-2xl' },
  md: { container: 'w-12 h-12', text: 'text-3xl' },
  lg: { container: 'w-16 h-16', text: 'text-4xl' },
  xl: { container: 'w-20 h-20', text: 'text-5xl' },
};

const imageSizes = {
  sm: '32px',
  md: '48px',
  lg: '64px',
  xl: '80px',
};

export function ToolIcon({ icon, name, size = 'md', className = '' }: ToolIconProps) {
  // Check if icon is an image URL or path
  const isImage = icon && (icon.startsWith('/') || icon.startsWith('http'));
  const sizeClass = sizeClasses[size];
  
  if (isImage) {
    try {
      return (
        <div className={`relative ${sizeClass.container} aspect-square shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 ${className}`}>
          <Image
            src={icon}
            alt={name}
            fill
            className="object-contain object-center p-1.5"
            sizes={imageSizes[size]}
            unoptimized={icon.startsWith('http')}
          />
        </div>
      );
    } catch (error) {
      return (
        <div className={`flex items-center justify-center ${sizeClass.container} aspect-square shrink-0 ${sizeClass.text} ${className}`}>
          {icon || "🛠️"}
        </div>
      );
    }
  }
  
  return (
    <div className={`flex items-center justify-center ${sizeClass.container} aspect-square shrink-0 ${sizeClass.text} ${className}`}>
      {icon || "🛠️"}
    </div>
  );
}
