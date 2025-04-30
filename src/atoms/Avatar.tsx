import React from 'react'
import { useUserStore } from '../store/userStore'
import defaultAvatarImage from '../assets/avatar/2.png'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ size = 'md', className = '' }) => {
  const user = useUserStore(state => state.user)
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  const defaultImage = defaultAvatarImage
  const imageUrl = user?.photo || defaultImage
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full border-2 border-teal-400 overflow-hidden ${className}`}
    >
      <img 
        src={imageUrl} 
        alt={user ? `${user.firstName} ${user.lastName}` : 'User avatar'} 
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default Avatar
