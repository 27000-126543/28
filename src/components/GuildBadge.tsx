import React from 'react';
import type { GuildBadge as GuildBadgeType } from '../types';

interface Props {
  badge: GuildBadgeType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-16 h-16 text-3xl',
  xl: 'w-24 h-24 text-5xl',
};

export const GuildBadge: React.FC<Props> = ({ badge, size = 'md' }) => {
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center border-2 shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${badge.color1}, ${badge.color2})`,
        borderColor: badge.color1,
        boxShadow: `0 0 15px ${badge.color1}40`,
      }}
    >
      <span className="drop-shadow-lg">{badge.icon}</span>
    </div>
  );
};
