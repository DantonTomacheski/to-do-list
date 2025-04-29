# App Flow Document

## Onboarding and Sign-In/Sign-Up

When a new user visits the application for the first time, they see a full-screen welcome page featuring a modern 3D illustration, a clear title, a brief description of the task manager and a prominent “Let’s Start” button. By tapping or clicking this button, the user moves to a simple form where they enter their first name and last name. An optional control allows them to upload a profile photo either by selecting a file from their device or by using the webcam API. Once they submit the form, the application uses Zustand with persistent storage to save the user’s name, surname and compressed Base64 photo into localStorage. Immediately after saving, the user is redirected to the main dashboard. There is no traditional sign-out flow since this is a single-user guest mode, but the settings screen provides an option to clear all data and restart the onboarding at any time.

## Main Dashboard or Home Page

After onboarding, the user lands on the main dashboard. At the top of the screen, a header shows the user’s circular profile picture on the left and a notification bell icon on the right. The bell icon displays a small badge with the count of in-app notifications. Below the header, a wide progress card spans across the screen showing the overall completion percentage of tasks across all projects. Underneath, a horizontally scrollable row presents each active project as a colored card with its logo and name. The cards use the custom palette and soft shadows defined in Tailwind CSS. At the bottom of the screen, a fixed navigation bar holds a central add button that opens a creation menu. From this dashboard, tapping on any project card or using the add button takes the user deeper into project or task flows.

## Detailed Feature Flows and Page Transitions

### Adding and Editing Projects

When the user taps the add button on the dashboard and selects “New Project,” the app transitions smoothly to a full-screen project form. The top bar shows a back arrow to return to the dashboard. The form fields request the project category from a fixed list, the project name, a description, start and end dates, and an option to upload a project logo. Real-time validation highlights empty required fields and shows error messages inline. When the user uploads an image, a compressed preview appears immediately. On saving, the store action creates or updates the project in Zustand, persists it in localStorage, and navigates back to the dashboard where the new or edited project card appears in the horizontal scroll.

### Project Tasks Screen

By tapping on a project card, the user goes to the project tasks screen. The screen header shows the project name and a back arrow. Below, a calendar strip displays five consecutive dates with left and right arrows to page through weeks. Under the calendar, a status filter bar lets the user switch among All, To-do, In Progress and Completed tasks. The task list updates with a smooth transition animation. Each task is shown as a card with its title, scheduled time and status icon. Tasks can be dragged between status columns, or the user can tap the status icon to cycle through states. All interactions include tactile feedback classes from Tailwind.

### Task Creation and Editing

Inside the project tasks screen, the user taps the floating add button to open a modal for adding a new task. The modal requests the task title, scheduled date and time. If the user omits any field, inline validation displays a brief error message. On confirming, the new task card appears directly in the correct status group. To edit a task, the user taps the task card itself, which reopens the modal prefilled with existing details. Saving updates the task slice in the store and the UI updates accordingly.

### Notifications Flow

When the user taps the bell icon in any header, a dropdown appears with a list of in-app notifications about upcoming or overdue tasks. Each notification shows the task title and its scheduled time. Tapping a notification closes the dropdown and navigates the user to the corresponding project tasks screen, with the calendar scrolled to the relevant date and the task highlighted. The notification badge count updates in real time as tasks move between statuses.

### PWA Installation Flow

On initial load, a nonintrusive banner appears inviting the user to install the app as a Progressive Web App. If the user accepts, the service worker caches all static assets and saved data, and the manifest file adds an icon to the home screen. From that moment on, the user can open the app offline and navigate all screens without connectivity. Any data changes continue to save to localStorage and sync with the UI normally.

## Settings and Account Management

The user accesses settings by tapping their profile picture in any header. This opens a settings page where they can change their first name, last name or profile photo. Image uploads are compressed and previewed before saving. As a guest mode, there is no password or sign-out. Instead, at the bottom of the settings page, the user finds a “Clear All Data” button that resets the Zustand store, clears localStorage and returns the user to the welcome screen as if they were brand new.

## Error States and Alternate Paths

If the user tries to submit a form field without entering required information, the field border turns red and a message appears explaining the issue. If image compression fails or the file is too large, an error toast informs the user and suggests picking a smaller file. When localStorage quota is exceeded, the application shows a full-screen warning explaining that data cannot be saved and invites the user to clear some projects or tasks. During service worker registration, if offline or blocked, the banner still offers PWA installation later when connectivity returns. All network failures are handled gracefully since the app is offline-first, and error messages guide the user back to normal operation.

## Conclusion and Overall App Journey

From first arrival on the welcome screen through filling out a simple guest form, the user moves seamlessly into the dashboard where they see their profile, notifications and progress cards. By tapping a project, the user drills into task lists with calendar navigation and status filters, adding or editing tasks via intuitive modals. Project creation and editing flows mirror the task flow, with real-time validation and image previews. The settings screen offers profile updates and data reset, while the PWA install banner ensures offline access. Throughout the journey, all data persists locally with Zustand and localStorage, ensuring the user can manage tasks reliably on any device without a server. This completes the full flow of the task management app from start to finish.