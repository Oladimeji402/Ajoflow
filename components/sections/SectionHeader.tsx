import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  serif: ReactNode;
  rest: ReactNode;
  subhead?: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  serif,
  rest,
  subhead,
  tone = 'light',
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const dark = tone === 'dark';
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'text-center mx-auto' : ''} ${className}`}>
      <p
        className={`text-[11px] font-bold tracking-[0.18em] uppercase mb-4 ${
          dark ? 'text-brand-accent' : 'text-brand-primary'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`leading-[1.04] ${dark ? 'text-white' : 'text-brand-navy'} ${
          centered ? 'mx-auto' : ''
        } ${subhead ? 'mb-4' : ''}`}
        style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
      >
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
          {serif}
        </span>{' '}
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em' }}>
          {rest}
        </span>
      </h2>
      {subhead ? (
        <p
          className={`text-[15px] leading-relaxed max-w-md ${
            dark ? 'text-white/55' : 'text-brand-gray'
          } ${centered ? 'mx-auto' : ''}`}
        >
          {subhead}
        </p>
      ) : null}
    </div>
  );
}
