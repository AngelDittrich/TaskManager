import React from 'react';
import './Card.css';

/**
 * Card Component
 * @param {string} variant - 'primary' (white), 'metric' (dark), 'glass' (blur)
 * @param {string} className - Additional classes
 * @param {ReactNode} children - Content
 */
const Card = ({ variant = 'primary', className = '', children, ...props }) => {
  return (
    <div className={`card card--${variant} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
