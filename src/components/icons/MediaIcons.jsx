import React from 'react';

// Универсальный базовый SVG-обертка с поддержкой size и color
const Svg = ({ children, size = 18, title, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    role={title ? 'img' : 'presentation'}
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
);

export const PlayIcon = ({ size = 18, color = 'currentColor', title = 'Play', ...rest }) => (
  <Svg size={size} title={title} {...rest}>
    <path fill={color} d="M8 5v14l11-7z" />
  </Svg>
);

export const PauseIcon = ({ size = 18, color = 'currentColor', title = 'Pause', ...rest }) => (
  <Svg size={size} title={title} {...rest}>
    <path fill={color} d="M6 5h4v14H6zm8 0h4v14h-4z" />
  </Svg>
);

// Пустое (контурное) сердечко
export const HeartIcon = ({ size = 18, color = 'currentColor', title = 'Like', strokeWidth = 2, ...rest }) => (
  <Svg size={size} title={title} {...rest}>
    <path
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.1 8.64l-.1.1-.1-.1C10.14 6.9 7.24 6.9 5.48 8.66c-1.76 1.76-1.76 4.62 0 6.38l.12.11L12 21l6.4-5.85.12-.11c1.76-1.76 1.76-4.62 0-6.38-1.76-1.76-4.66-1.76-6.42 0z"
    />
  </Svg>
);

// Заполненное сердечко
export const HeartFilledIcon = ({ size = 18, color = 'currentColor', title = 'Liked', ...rest }) => (
  <Svg size={size} title={title} {...rest}>
    <path
      fill={color}
      d="M12 21s-4.35-3.98-6.37-5.93C3.05 12.57 3 9.9 4.76 8.14a4.5 4.5 0 016.36 0l.88.88.88-.88a4.5 4.5 0 016.36 0c1.76 1.76 1.7 4.43-.87 6.93C16.35 17.02 12 21 12 21z"
    />
  </Svg>
);

export default { PlayIcon, PauseIcon };
