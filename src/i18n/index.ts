import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  'pt-BR': {
    translation: {
      // Onboarding
      welcomeTitle: 'Gerenciamento de Tarefas & Lista de Afazeres',
      welcomeSubtitle: 'Organize seus projetos e tarefas de forma simples e eficiente.',
      letsStart: 'Vamos Começar',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      photo: 'Foto (opcional)',
      saveProfile: 'Salvar Perfil',
      firstNameRequired: 'Nome é obrigatório',
      lastNameRequired: 'Sobrenome é obrigatório',
      uploadPhoto: 'Carregar Foto',
      takePhoto: 'Tirar Foto',
      removePhoto: 'Remover Foto',
      
      // Dashboard
      hello: 'Olá!',
      todaysTaskProgress: 'Sua tarefa de hoje está quase concluída!',
      viewTask: 'Ver Tarefa',
      inProgress: 'Em Progresso',
      taskGroups: 'Grupos de Tarefas',
      officeProject: 'Projeto de Escritório',
      personalProject: 'Projeto Pessoal',
      dailyStudy: 'Estudo Diário',
      tasks: 'Tarefas',
      changeLanguage: 'Mudar Idioma',
      home: 'Início',
      calendar: 'Calendário',
      addNew: 'Adicionar',
      profile: 'Perfil'
    }
  },
  'en-US': {
    translation: {
      // Onboarding
      welcomeTitle: 'Task Management & To-Do List',
      welcomeSubtitle: 'Organize your projects and tasks in a simple and efficient way.',
      letsStart: 'Let\'s Start',
      firstName: 'First Name',
      lastName: 'Last Name',
      photo: 'Photo (optional)',
      saveProfile: 'Save Profile',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      uploadPhoto: 'Upload Photo',
      takePhoto: 'Take Photo',
      removePhoto: 'Remove Photo',
      
      // Dashboard
      hello: 'Hello!',
      todaysTaskProgress: 'Your today\'s task almost done!',
      viewTask: 'View Task',
      inProgress: 'In Progress',
      taskGroups: 'Task Groups',
      officeProject: 'Office Project',
      personalProject: 'Personal Project',
      dailyStudy: 'Daily Study',
      tasks: 'Tasks',
      changeLanguage: 'Change Language',
      home: 'Home',
      calendar: 'Calendar',
      addNew: 'Add New',
      profile: 'Profile'
    }
  }
}

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language || 'pt-BR', // Default to pt-BR if browser language not detected
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  })

export default i18n