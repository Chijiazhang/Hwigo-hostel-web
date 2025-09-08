import React from 'react';

interface BirdIconProps {
  className?: string;
}

export const BirdIcon: React.FC<BirdIconProps> = ({ className = "size-4" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 飞鸟主体 */}
      <path 
        d="M12 4C8 4 6 8 6 12C6 16 8 20 12 20C16 20 18 16 18 12C18 8 16 4 12 4Z" 
        fill="white"
      />
      {/* 鸟头 */}
      <path 
        d="M12 4C10 4 8.5 6 8.5 8.5C8.5 9.5 9 10.5 9.5 11C10 11.5 11 12 12 12C13 12 14 11.5 14.5 11C15 10.5 15.5 9.5 15.5 8.5C15.5 6 14 4 12 4Z" 
        fill="#1e293b"
      />
      {/* 鸟嘴 */}
      <path 
        d="M12 8.5L13.5 7L12 5.5L10.5 7L12 8.5Z" 
        fill="#1e293b"
      />
      {/* 翅膀 */}
      <path 
        d="M8 10C6 12 6 14 8 16C10 18 12 18 14 16C16 14 16 12 14 10C12 8 10 8 8 10Z" 
        fill="white"
      />
      {/* 尾巴 */}
      <path 
        d="M6 14L8 16L6 18L4 16L6 14Z" 
        fill="white"
      />
    </svg>
  );
};





