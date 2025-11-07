import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.5 5-5-1.5L7 12l-5.5 1.5 5 1.5L12 21l1.5-5 5 1.5L17 12l5.5-1.5-5-1.5Z" />
  </svg>
);

export default SparklesIcon;
