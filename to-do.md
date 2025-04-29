# Prompt Refinado para Projeto de Gerenciamento de Tarefas com Atomic Design e Tailwind CSS

````
Crie um aplicativo completo de gerenciamento de tarefas usando Vite, React 18, TypeScript, Zustand com persist storage, Tailwind CSS e testes com Jest e React Testing Library. O projeto deve seguir rigorosamente a metodologia Atomic Design e implementar as telas exatas mostradas nos designs de referência.

## Tecnologias e Estrutura

- Vite como bundler e ferramenta de desenvolvimento
- React 18 com TypeScript
- Gerenciamento de estado com Zustand + persistência via localStorage
- Estilização com Tailwind CSS para uma abordagem utility-first
- Testes unitários e de integração com Jest e React Testing Library
- Estrutura de pastas seguindo Atomic Design:
  - /atoms (elementos básicos: botões, inputs, ícones, tipografia)
  - /molecules (combinações de átomos: cards de tarefa, itens de navegação)
  - /organisms (seções funcionais: listas de tarefas, cabeçalhos, barras de navegação)
  - /templates (estruturas de página sem dados específicos)
  - /pages (implementações concretas com dados reais)

## Configuração do Tailwind CSS

- Instalar e configurar Tailwind CSS com PostCSS no projeto Vite
- Estender o tema do Tailwind no arquivo tailwind.config.js para incluir:
  - Cores personalizadas do design (roxo principal, rosa, laranja, etc.)
  - Fontes personalizadas
  - Border-radius personalizado para cards
  - Tamanhos personalizados para ícones e avatares
  - Extensões para animações e transições
- Criar componentes com classes utilitárias do Tailwind em vez de CSS customizado
- Utilizar @apply apenas quando necessário para reutilização de estilos complexos

## Interfaces TypeScript

### Usuario
```typescript
interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  fotoPerfil?: string;
}
````

### Projeto

```typescript
interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  categoria: "Work" | "Personal Project" | "Daily Study" | string;
  dataInicio: string;
  dataFim: string;
  logo?: string;
  corCategoria: string;
  progresso: number; // 0-100
  tarefas: Tarefa[];
}
```

### Tarefa

```typescript
interface Tarefa {
  id: string;
  projetoId: string;
  titulo: string;
  status: "To-do" | "In Progress" | "Done";
  horario: string; // formato '10:00 AM'
  dataAgendada: string; // formato ISO
}
```

## Telas Detalhadas

### 1. Tela de Boas-vindas/Login

- **Átomos com Tailwind**:
  - Logo da aplicação (w-24 h-24)
  - Título principal (text-3xl font-bold text-gray-800)
  - Texto descritivo (text-base text-gray-600 text-center max-w-xs)
  - Botão primário (bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 px-8 flex items-center transition-all duration-300)
- **Moléculas**: Header com título e subtítulo, botão de ação primário 'Let's Start' com ícone de seta
- **Organismos**: Ilustração central (personagem 3D com laptop e elementos flutuantes), container para conteúdo centralizado
- **Template**: Estrutura de página de boas-vindas com fundo gradiente suave (bg-gradient-to-br from-green-50 via-white to-purple-50)
- **Interações**:
  - Ao clicar em "Let's Start", transição suave (slide-up, 300ms, cubic-bezier) para o formulário de registro
  - O formulário de registro deve capturar: Nome, Sobrenome, Foto (opcional)
  - Validação de formulário: campos de nome não podem estar vazios
  - Armazenar dados de usuário via Zustand com persistência

### 2. Tela Principal/Dashboard

- **Átomos com Tailwind**:
  - Avatar de usuário circular (w-10 h-10 rounded-full border-2 border-teal-400)
  - Nome de usuário (font-bold text-gray-800)
  - Ícone de notificação (w-6 h-6 text-gray-600)
  - Rótulos de categoria (text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-md)
  - Barras de progresso (h-1.5 bg-blue-100 rounded-full com inner div para progresso)
  - Círculos de progresso (utilizando SVG com classes Tailwind para estilização)
- **Moléculas**:
  - Cabeçalho com perfil e notificação (flex items-center justify-between p-4 bg-white rounded-b-xl)
  - Card de progresso roxo (bg-purple-600 p-4 rounded-xl text-white)
  - Cards de projeto em andamento (bg-white rounded-xl p-3 shadow-sm)
  - Cards de grupos de tarefas (bg-white p-3 rounded-xl flex items-center justify-between)
  - Itens de navegação inferior
- **Organismos**:
  - Seção de progresso de hoje
  - Lista horizontal de projetos em andamento (flex space-x-4 overflow-x-auto)
  - Lista vertical de grupos de tarefas (space-y-3)
  - Barra de navegação inferior (bg-white p-3 flex justify-between items-center relative)
- **Template**: Layout de dashboard com cabeçalho, conteúdo principal scrollável e navegação fixa inferior
- **Interações**:
  - Transições suaves em todos os elementos interativos (hover:scale-105 transition-all duration-200)
  - Ao clicar em "View Task", navegar para lista de tarefas do dia
  - Ao clicar em um card de projeto, abrir tela detalhada daquele projeto
  - Ao clicar em grupo de tarefas, filtrar visualização por aquele grupo
  - Botão de adição (+) abre modal/tela para adicionar novo projeto ou tarefa
  - Navegação inferior permite alternar entre diferentes visualizações

### 3. Tela de Tarefas Específicas de um Projeto

- **Átomos com Tailwind**:
  - Botão de voltar (w-6 h-6 text-gray-800)
  - Título da página (font-semibold text-lg text-center)
  - Seletor de data (bg-white px-4 py-2 rounded-2xl flex flex-col items-center, com variante ativa bg-indigo-600 text-white)
  - Filtros de status (bg-indigo-600 text-white px-4 py-1 rounded-full, com variante inativa bg-indigo-100 text-indigo-600)
  - Ícones de tempo (w-4 h-4 text-indigo-400)
  - Etiquetas de status (text-xs font-medium px-2 py-1 rounded-full, com cores variáveis baseadas no status)
- **Moléculas**:
  - Barra superior com botão de voltar e título "Today's Tasks"
  - Seletor de calendário horizontal mostrando 5 dias (23-27 de maio), com dia atual destacado
  - Filtros de status (All, To do, In Progress, Completed)
  - Cards de tarefa individuais (bg-white p-4 rounded-xl mb-3 flex flex-col)
- **Organismos**:
  - Cabeçalho com navegação e título (p-4 flex items-center justify-between)
  - Navegador de calendário horizontal (flex space-x-2 p-4)
  - Barra de filtros de status (flex space-x-2 p-4)
  - Lista scrollável de tarefas (flex-1 p-4 overflow-y-auto)
  - Navegação inferior com botão de adicionar
- **Template**: Layout de lista de tarefas com filtros, ordenação cronológica e agrupamento por projeto
- **Interações**:
  - **DETALHES ATÔMICOS**:
    - Ao tocar em uma tarefa: active:bg-gray-50 transform active:scale-[0.99] transition-all
    - Ripple effect usando after:absolute after:bg-indigo-100/50 after:rounded-full
    - Transição entre abas: deslize horizontal com indicador animado (transition-all duration-200)
    - Ao selecionar data diferente: indicador ativo move-se com animação (transition-transform duration-200), lista atualiza com fade cross-dissolve
    - Estados skeleton: animate-pulse bg-gray-200 para cada elemento
    - Estado vazio: ilustração central com mensagem "No tasks for this day"
    - Rolagem da lista: overscroll-behavior-y: contain
  - Filtros funcionais: ao selecionar filtro, lista atualiza para mostrar apenas tarefas correspondentes
  - Ao clicar no botão de voltar, retorna à tela anterior com animação inversa
  - Ao clicar no botão +, abre modal para adicionar nova tarefa ao projeto atual

### 4. Tela de Adição/Edição de Projeto

- **Átomos com Tailwind**:
  - Campo de entrada de texto (w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all)
  - Seletor dropdown (mesmas classes do input + aparência customizada)
  - Campo de texto multilinha (mesmas classes base + min-h-[120px] resize-none)
  - Seletores de data (flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200)
  - Avatar de projeto (w-12 h-12 rounded-full object-cover)
  - Botão de alteração de logo (bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium)
- **Moléculas**:
  - Barra superior com título "Add Project" e botão de voltar (p-4 flex items-center justify-between)
  - Seletor de categoria de projeto (dropdown)
  - Campo de nome de projeto com validação
  - Campo de descrição multilinha
  - Seletores de data de início e fim
  - Seletor de logo/imagem do projeto (flex items-center space-x-4)
- **Organismos**:
  - Formulário completo de projeto (flex flex-col space-y-4 p-4)
  - Validação em tempo real dos campos
  - Visualização prévia de logo/imagem selecionada
- **Template**: Layout de formulário com campos organizados verticalmente e espaçamento consistente
- **Interações**:
  - Validação em tempo real dos campos (nome não pode estar vazio)
  - Ao selecionar datas, exibir calendário modal com animação de entrada/saída
  - "Change Logo" abre seletor de imagem (galeria ou câmera)
  - Botão de salvar (não visível na imagem, mas necessário) deve ter feedback visual ao pressionar
  - Ao salvar, mostrar animação de sucesso e retornar à tela anterior

## Store com Zustand

```typescript
interface TaskStore {
  usuario: Usuario | null;
  projetos: Projeto[];
  tarefasHoje: Tarefa[];

  // Ações de usuário
  setUsuario: (usuario: Usuario) => void;

  // Ações de projetos
  adicionarProjeto: (projeto: Omit<Projeto, "id" | "progresso">) => void;
  editarProjeto: (id: string, dados: Partial<Projeto>) => void;
  removerProjeto: (id: string) => void;

  // Ações de tarefas
  adicionarTarefa: (tarefa: Omit<Tarefa, "id">) => void;
  editarTarefa: (id: string, dados: Partial<Tarefa>) => void;
  mudarStatusTarefa: (id: string, status: Tarefa["status"]) => void;
  removerTarefa: (id: string) => void;

  // Métodos auxiliares
  calcularProgressoProjeto: (projetoId: string) => number;
  getTarefasPorDia: (data: string) => Tarefa[];
  getTarefasPorProjeto: (projetoId: string) => Tarefa[];
  getProjetosPorCategoria: (categoria: string) => Projeto[];
}
```

## Configuração do tailwind.config.js

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B3FFF",
        "primary-light": "#F5F3FF",
        "pink-category": "#EC4899",
        "orange-category": "#F97316",
        "blue-progress": "#3B82F6",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.05)",
        floating: "0 10px 25px -5px rgba(91, 63, 255, 0.3)",
      },
      animation: {
        progress: "progress 1s ease-out forwards",
        ripple: "ripple 600ms linear",
        "slide-up": "slideUp 300ms ease-out",
      },
      keyframes: {
        progress: {
          "0%": { "stroke-dashoffset": "94.2" },
          "100%": { "stroke-dashoffset": "var(--progress-offset)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

## Paleta de Cores (já configurada no Tailwind)

- Roxo principal: #5B3FFF (primary)
- Roxo claro: #F5F3FF (primary-light)
- Rosa: #EC4899 (pink-category)
- Laranja: #F97316 (orange-category)
- Azul: #3B82F6 (blue-progress)
- Branco: #FFFFFF
- Cinza claro: #F3F4F6 (gray-100)
- Cinza médio: #9CA3AF (gray-400)
- Cinza escuro: #1F2937 (gray-800)

## Animações e Transições (via classes Tailwind)

- Transição entre telas: transition-all duration-300 ease-in-out
- Feedback em botões: active:scale-98 transition-transform duration-100
- Círculos de progresso: animate-progress com variáveis CSS personalizadas
- Cards: hover:translate-y-[-2px] hover:shadow-lg transition-all
- Adição/remoção de itens: classes dinâmicas com animate-slide-up
- Notificações/alertas: classes dinâmicas com transformações e transições

## Responsividade (via Tailwind)

- Design mobile-first otimizado para telas de 360px a 768px
- Classes responsivas do Tailwind (sm:, md:, lg:, xl:)
- Container com classes mx-auto max-w-md para centralização
- Flexbox e Grid via classes Tailwind para layouts adaptáveis

## Testes

- Testes unitários para:
  - Componentes atômicos
  - Lógica de cálculo de progresso
  - Formatação de datas e horários
- Testes de integração para:
  - Fluxos de adição/edição/remoção de projetos e tarefas
  - Persistência de dados via localStorage
  - Filtragem e agrupamento de tarefas
- Mocks para simulação de localStorage e APIs externas

Implementar toda a aplicação com tipagem TypeScript estrita e garantir que a arquitetura Atomic Design seja rigorosamente seguida. O resultado final deve ser visualmente idêntico às imagens de referência e fornecer uma experiência de usuário fluida com todas as animações e transições especificadas utilizando as classes utilitárias do Tailwind CSS.

```

Este prompt foi refinado para incluir instruções detalhadas sobre o uso do Tailwind CSS em todo o projeto. Adicionei:

1. Configuração específica do Tailwind e customização do tema
2. Classes Tailwind detalhadas para cada componente atômico
3. Um exemplo de arquivo tailwind.config.js completo
4. Como implementar animações e transições usando as utilidades do Tailwind
5. Adaptação da metodologia Atomic Design para trabalhar eficientemente com Tailwind

O prompt mantém todos os requisitos originais enquanto integra completamente o Tailwind CSS como o sistema de estilização principal do projeto.
```
