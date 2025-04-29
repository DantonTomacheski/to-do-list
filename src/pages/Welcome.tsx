import React from 'react'
import { useNavigate } from 'react-router-dom'
import GradientPageTemplate from '../templates/GradientPageTemplate'
import WelcomeContent from '../organisms/WelcomeContent'
import { useUserStore } from '../store/userStore'
import { User } from '../store/userStore'

const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const setUser = useUserStore(state => state.setUser)
  
  const handleRegister = (userData: User) => {
    // Store user data in Zustand with localStorage persistence
    setUser(userData)
    
    // Navigate to dashboard
    navigate('/dashboard')
  }
  
  return (
    <GradientPageTemplate>
      <WelcomeContent onRegister={handleRegister} />
    </GradientPageTemplate>
  )
}

export default Welcome
