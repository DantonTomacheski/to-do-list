## 📑 Guia Definitivo de Tela → Comportamento → Store

> **Formato direto**: cada tela vem com  
> • _Onde clicar_ → _o que acontece_ → _efeito visual_  
> • Estados vazios × cheios  
> • Estrutura **única** no Zustand que sustenta tudo

---

### 🖼️ 1. `/welcome` – Onboarding

| UI                | Ação do usuário   | Resultado                                                   | Efeito                   |
| ----------------- | ----------------- | ----------------------------------------------------------- | ------------------------ |
| **“Let’s Start”** | Tap               | Roteia para `/dashboard` **quando** `firstName && lastName` | `button:active:scale-95` |
| Campo Foto        | Selecionar imagem | Salva `photo` no store                                      | Fade-in de mini-preview  |
| “Skip” (opcional) | Tap               | Salva `isOnboarded=true` sem foto                           | Nenhum                   |

**Estados**  
_Vazio_: inputs highlight vermelho ao blur se vazios.  
_Cheio_: botão fica `bg-primary` (antes é `bg-primary/50`).

---

### 🖼️ 2. `/dashboard`

| Elemento            | Clique      | Navega/Abre                | Efeito         |
| ------------------- | ----------- | -------------------------- | -------------- |
| **Avatar**          | Tap         | `/profile`                 | ripple         |
| **Bell**            | Tap         | Dropdown notificações      | slide-down     |
| **Progress Card**   | “View Task” | `/calendar?date=today`     | push-right     |
| **Project Card**    | Card        | `/projects/:id`            | scale-up 101 % |
| **Task Group Card** | Card        | `/calendar?filter=groupId` | fade list      |
| **FAB +**           | Tap         | `/projects/new` modal      | slide-up modal |

**Vazio** (sem projetos) → mostra ilustração + “Create your first project”.

---

### 🖼️ 3. `/calendar` – Agenda Global

| UI (átomo / molécula)                                            | Ação do usuário                                 | Resultado no app                                                                    | Feedback visual / UX extra                                                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Top-Bar**<br>← _BtnBack_ + Titulo “Today’s Tasks” + _BellIcon_ | Tap em **BtnBack**                              | `history.back()`                                                                    | `active:scale-95` + haptic curto (mobile)                                                                                  |
| **BellIcon**                                                     | Tap                                             | Abre pop-over com últimas 3 notificações                                            | Pop-over desliza de cima ( `animate-slide-down`) e sombra `shadow-lg`                                                      |
| **HorizontalScroll <DayChip/>**                                  | **Swipe** ou **Tap** em chip                    | Atualiza `selectedDate` no store e Query param `?date=YYYY-MM-DD`. Lista recarrega. | Chip ativo muda para `bg-primary text-white` com transição `transition-colors duration-150`; outros retornam a `bg-white`. |
| `DayChip` (Hold 1 s)                                             | Pressão longa                                   | Abre _date-picker_ nativo para salto rápido                                         | Escurece (`bg-black/10`) durante hold; date-picker modal `animate-slide-up`                                                |
| **StatusFilterBar <StatusFilterChip/>**                          | Tap                                             | Escreve `statusFilter` no store; filtra lista local                                 | Chip ativo recebe sub-linha (`after:h-0.5 after:bg-primary after:w-full`) e tipografia bold                                |
| **TaskCard**                                                     | Tap rápido                                      | Navega para `/projects/:id/tasks?task=:tid` detalhe/edit                            | Card faz `active:translate-y-0.5` e sombra reduz                                                                           |
| `TaskCard` **Swipe→Right**                                       | Gesto 60 px                                     | Muda `status` **para o próximo** ciclo (`To-do → In Progress → Done`)               | Card segue o dedo (translate-x) + badge troca cor; snackbar “Status updated”                                               |
| `TaskCard` **Swipe←Left**                                        | Gesto 60 px                                     | Abre _action-drawer_ inferior (Edit / Delete)                                       | Drawer `animate-slide-up`; fundo escurece `bg-black/30`                                                                    |
| `TaskCard` **Drag-hold 300 ms**                                  | Entra modo _re-order_ (quando filtrado por dia) | Ativa `cursor-grab`, outras cards afrouxam (`opacity-70`)                           | Layout `gap-4` com placeholder; ao soltar, ordem persiste em store                                                         |
| **Pull-to-Refresh**                                              | Arrastar lista p/ baixo >60 px                  | Refetch localStorage (ou API, se existir)                                           | Spinner 24 px `animate-spin` no topo                                                                                       |
| **FAB AddTask (+)**                                              | Tap                                             | `/tasks/new?date=selectedDate` modal                                                | Botão ‘quica’ (`scale-90 → 100`) com sombra `shadow-floating`                                                              |
| **Left-edge Swipe**                                              | Arrastar >50 px da borda                        | Pop para `/dashboard`                                                               | Página desliza p/ direita (200 ms) com _ease-out_                                                                          |
| **Scrollbar**                                                    | Rolagem                                         | Prefetch de próxima página se lista >30 itens (paginação infinita)                  | Skeleton (`animate-pulse`) 3 cards aparecem em fim de lista                                                                |
| **Keyboard shortcuts** (desktop)                                 | `←`/`→`                                         | Navega entre dias                                                                   | `DayChip` selecionado pisca uma vez                                                                                        |
| **Dark-mode**                                                    | Sistema escuro                                  | Cores primordialmente `bg-gray-800 text-gray-200`                                   | Chips ativos usam `bg-primary/80`                                                                                          |

#### Estados

| Estado                             | UI específica                      | Texto / Ilustração                                           |
| ---------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| **Loading**                        | 4 skeleton cards `animate-pulse`   | —                                                            |
| **Sem tarefas**                    | Ilustração SVG caixa vazia, `h-40` | “No tasks for this day” + Btn “Add a task” (atalho p/ FAB)   |
| **Erro (localStorage corrompida)** | Toast vermelho                     | “Couldn’t load tasks. Reset data?” (`onConfirm` limpa store) |

#### Acessibilidade

- Todos os chips `role="tab"`; `aria-selected="true"` no ativo.
- `TaskCard` tem `aria-label="Task ‹title›, status ‹status›, scheduled ‹time›"`.
- Swipe ações duplicadas em menu de contexto (3 pontos) para leitores de tela.

---

> **Store impactado**: `selectedDate`, `statusFilter` são mantidos em `useAppStore` para reidratação consistente entre sessões. Tarefas alteradas via swipe escrevem diretamente o `tasks[id].status`.

---

### 🖼️ 4. `/projects/:id` – Visão do Projeto

| UI             | Ação | Resultado                                                           |
| -------------- | ---- | ------------------------------------------------------------------- | -------------------- |
| Header Back    | Tap  | history.back()                                                      |
| “Add Task” FAB | Tap  | `/tasks/new?project=:id` modal                                      |
| TaskList Item  | Tap  | altera status ciclícamente **local** (`To-do → In Progress → Done`) | badge color transita |

---

### 🖼️ 5. `/projects/:id/tasks` – Today’s Tasks do Projeto

| UI          | Clique     | Store / Navegação                   |
| ----------- | ---------- | ----------------------------------- |
| DayChip     | Tap        | `selectedDate` só deste projeto     |
| Status Chip | Tap        | filtro local                        |
| TaskCard    | Long-press | abre _action sheet_ (Edit / Delete) |
| Clock ícone | Tap        | abre time-picker inline             |

**Skeleton**: `animate-pulse bg-gray-200 h-20 rounded-xl` enquanto carrega.

---

### 🖼️ 6. `modal /projects/new` & `modal /tasks/new`

- `onSave` grava no store e fecha (`animate-slide-down`)
- Validação live (`input:invalid:border-red-500`)

---

## 🗄️ Zustand — **uma store para tudo** (além do `useUserStore` já existente)

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formatISO } from "date-fns";

export type TaskStatus = "To-do" | "In Progress" | "Done";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  scheduledDate: string; // ISO-only date “2025-05-25”
  time: string; // “19:00”
  status: TaskStatus;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  category: "Work" | "Personal Project" | "Daily Study" | string;
  color: string; // ex. “pink-category”
  logo?: string; // data URL
  createdAt: string;
}

interface AppState {
  projects: Record<string, Project>;
  tasks: Record<string, Task>;

  // derived filters
  tasksByDate: (isoDate: string) => Task[];
  tasksByProjectDate: (pid: string, isoDate: string) => Task[];

  // crud
  addProject: (p: Omit<Project, "id" | "createdAt">) => string;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addTask: (t: Omit<Task, "id">) => string;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: {},
      tasks: {},

      tasksByDate: (d) =>
        Object.values(get().tasks).filter((t) => t.scheduledDate === d),

      tasksByProjectDate: (pid, d) =>
        Object.values(get().tasks).filter(
          (t) => t.projectId === pid && t.scheduledDate === d
        ),

      addProject: (p) => {
        const id = crypto.randomUUID();
        set((state) => ({
          projects: {
            ...state.projects,
            [id]: {
              ...p,
              id,
              createdAt: formatISO(new Date(), { representation: "date" }),
            },
          },
        }));
        return id;
      },

      updateProject: (id, data) =>
        set((state) => ({
          projects: {
            ...state.projects,
            [id]: { ...state.projects[id], ...data },
          },
        })),

      removeProject: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.projects;
          const tasks = Object.fromEntries(
            Object.entries(state.tasks).filter(([, t]) => t.projectId !== id)
          );
          return { projects: rest, tasks };
        }),

      addTask: (t) => {
        const id = crypto.randomUUID();
        set((state) => ({ tasks: { ...state.tasks, [id]: { ...t, id } } }));
        return id;
      },

      updateTask: (id, data) =>
        set((state) => ({
          tasks: { ...state.tasks, [id]: { ...state.tasks[id], ...data } },
        })),

      removeTask: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.tasks;
          return { tasks: rest };
        }),
    }),
    { name: "app-storage" }
  )
);
```

### 💡 Observações de performance

- **Selectors** nos componentes consumindo `tasksByDate` ou `tasksByProjectDate` para evitar re-renders globais.
- Usar `immer` opcionalmente (`import { immer } from 'zustand/middleware/immer'`) se quiser mutações mais limpas.

---

## ✨ Efeitos Tailwind prontos

| Classe utilitária             | Onde é usada    |
| ----------------------------- | --------------- |
| `transition-all duration-200` | chips, cards    |
| `active:scale-95`             | buttons & cards |
| `shadow-card hover:shadow-lg` | cards           |
| `animate-slide-up`            | modais entrando |
| `animate-slide-down`          | modais saindo   |
| `animate-ripple` (pseudo)     | FAB, chips      |

---

Cole esse guia no seu **CLAUDE.md** ou `documentation/flow.md` e siga – não há mais decisões abertas.
