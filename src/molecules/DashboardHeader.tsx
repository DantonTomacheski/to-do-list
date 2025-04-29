import React from 'react'
import { useTranslation } from 'react-i18next'
import Avatar from '../atoms/Avatar'
import NotificationIcon from '../atoms/NotificationIcon'
import LanguageSwitcher from '../atoms/LanguageSwitcher'
import { useUserStore } from '../store/userStore'

const DashboardHeader: React.FC = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-b-xl">
      <div className="flex items-center">
        <Avatar size="md" />
        <div className="ml-3">
          <p className="font-bold text-gray-800">{t('hello')}</p>
          <p className="text-gray-700">{user?.firstName} {user?.lastName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <NotificationIcon />
      </div>
    </div>
  )
}

export default DashboardHeader
