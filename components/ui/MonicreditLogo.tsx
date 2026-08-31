import Image from 'next/image';

type MonicreditLogoProps = {
  size?: number;
  className?: string;
};

export function MonicreditLogo({ size = 22, className = '' }: MonicreditLogoProps) {
  return (
    <Image
      src="/monicredit.png"
      alt="Monicredit"
      width={203}
      height={207}
      className={`h-auto w-auto ${className}`}
      style={{ height: size, width: 'auto' }}
    />
  );
}
