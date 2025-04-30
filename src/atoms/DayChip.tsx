import React from 'react'
import { format, isToday } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

interface DayChipProps {
  date: Date
  isSelected: boolean
  onClick: () => void
  onLongPress?: () => void
}

const DayChip: React.FC<DayChipProps> = ({ 
  date, 
  isSelected, 
  onClick,
  onLongPress
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'pt-BR' ? ptBR : enUS
  
  // Track long press
  const [pressing, setPressing] = React.useState(false)
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null)
  
  const handleMouseDown = () => {
    setPressing(true)
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress()
      }
      setPressing(false)
    }, 1000) // 1 second for long press
  }
  
  const handleMouseUp = () => {
    if (pressing && longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      setPressing(false)
      onClick()
    }
  }
  
  const handleTouchStart = () => {
    setPressing(true)
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress()
      }
      setPressing(false)
    }, 1000)
  }
  
  const handleTouchEnd = () => {
    if (pressing && longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      setPressing(false)
      onClick()
    }
  }
  
  const handleTouchCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      setPressing(false)
    }
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 h-20 mx-1 transition-colors duration-150 select-none
        ${isSelected ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}
        ${pressing ? 'bg-black/10' : ''}
        ${isToday(date) && !isSelected ? 'border-2 border-purple-600' : ''}
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleTouchCancel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      role="tab"
      aria-selected={isSelected}
    >
      <span className="text-xs uppercase">
        {format(date, 'EEE', { locale })}
      </span>
      <span className="text-xl font-bold">
        {format(date, 'd', { locale })}
      </span>
    </div>
  )
}

export default DayChip
