flowchart TD
    Start[Start App] --> Onboarding[Onboarding]
    Onboarding --> Welcome[Welcome Login]
    Welcome --> Dashboard[Dashboard]
    Dashboard --> Projects[Project Management]
    Dashboard --> Calendar[Calendar Filters]
    Dashboard --> Notifications[Notifications]
    Dashboard --> Offline[Offline Support]
    Projects --> ProjectTasks[Project Tasks]
    ProjectTasks --> AddEdit[Add Edit Screens]
    Calendar --> FilteredTasks[Filtered Task List]
    AddEdit --> Dashboard
    FilteredTasks --> Dashboard