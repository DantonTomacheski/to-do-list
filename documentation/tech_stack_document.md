# Documento de Stack Tecnológica do Aplicativo de Gerenciamento de Tarefas

Este documento explica, em linguagem simples, as escolhas de tecnologia para o projeto de gerenciamento de tarefas. O objetivo é mostrar como cada ferramenta contribui para uma experiência rápida, bonita e confiável, sem exigir conhecimento técnico prévio.

## 1. Tecnologias de Frontend

No lado do cliente (o que o usuário enxerga e interage):

- **Vite**
  - Ambiente de desenvolvimento super rápido e com recarregamento instantâneo. Facilita criar e testar alterações em tempo real.
- **React 18**
  - Biblioteca que organiza a interface em componentes reutilizáveis, tornando o código mais claro e fácil de manter.
- **TypeScript**
  - Adiciona verificação de tipos ao JavaScript, evitando muitos erros antes mesmo de executar o app.
- **Tailwind CSS**
  - Utiliza classes prontas para estilizar cada elemento, agilizando a criação de layouts responsivos e consistentes.
  - Configuração personalizada inclui:
    - Cores do projeto (roxo: #5B3FFF, rosa: #EC4899, laranja: #F97316)
    - Bordas arredondadas, sombras suaves e animações específicas
    - Plugin `@tailwindcss/forms` para estilizar formulários de forma padronizada
- **Atomic Design**
  - Estrutura de pastas e componentes dividida em:
    - Átomos (botões, inputs, ícones)
    - Moléculas (combinações de átomos, como campos de formulário)
    - Organismos (seções maiores, como cabeçalho ou cartões)
    - Templates (layouts de página)
    - Páginas (telas finais com lógica de navegação)
  - Garante organização e escalabilidade do código.
- **Lucide React**
  - Biblioteca de ícones leve e customizável, seguindo o estilo minimalista do projeto.
- **Ilustrações 3D (unDraw, Blush)**
  - Assets gratuitos adaptáveis às cores do projeto para dar vida à interface.
- **Preparação para i18n**
  - Código estruturado para suportar múltiplos idiomas (português e inglês) e formatos de data/hora locais.

## 2. Tecnologias de Backend (Estado e Persistência)

Como não há servidor externo, todo o gerenciamento de dados acontece no próprio navegador:

- **Zustand com middleware de persistência**
  - Armazena o estado global (usuário, projetos, tarefas) de forma simples e performática.
- **localStorage**
  - Salva as informações no navegador para que nada se perca ao recarregar a página ou fechar a aba.
- **Imagens em Base64 + compressão**
  - Fotos de perfil e logos de projeto são convertidas para Base64 e comprimidas via `browser-image-compression`, garantindo uso offline e evitando estourar o limite de espaço.

## 3. Infraestrutura e Deploy

Tudo o que garante que o app esteja disponível na web, sempre atualizado e escalável:

- **GitHub**
  - Controle de versões: cada alteração no código fica registrada e reversível.
- **CI/CD com GitHub Actions**
  - Automatiza testes, build e deploy sempre que o código é atualizado.
- **Vercel**
  - Plataforma de hospedagem com CDN global, garantindo carregamento rápido em qualquer lugar.
- **PWA (Progressive Web App)**
  - Service Worker e manifest configurados para:
    - Funcionar offline após o primeiro acesso
    - Oferecer instalação no dispositivo como um app nativo
    - Exibir splash screen e ícones personalizados
- **Build otimizado pelo Vite**
  - Gera pacotes enxutos e divide o código em pedaços carregados sob demanda para melhor performance.

## 4. Integrações de Terceiros

Serviços e bibliotecas externas que adicionam funcionalidades específicas:

- **browser-image-compression**
  - Otimiza tamanho de imagens no cliente antes de salvar no localStorage.
- **unDraw / Blush**
  - Fontes de ilustrações gratuitas e customizáveis.
- **Lucide React**
  - Ícones de interface em componentes React, fáceis de colorir e redimensionar.

## 5. Ferramentas de Desenvolvimento

Recursos que tornam o fluxo de criação mais produtivo:

- **Windsurf IDE**
  - Ambiente integrado com sugestões de código por IA.
- **Claude 3.7 Sonnet & GPT-4.1**
  - Assistentes de inteligência artificial que auxiliam na geração de trechos de código, revisão e documentação.

## 6. Segurança e Considerações de Performance

Medidas para manter os dados seguros e garantir que o app seja ágil:

- **Modelo ‘guest’ local**
  - Sem login externo, evita exposição de credenciais. Os dados ficam isolados no dispositivo.
- **Compressão de imagens**
  - Previne estouro de localStorage e mantém o app leve.
- **Cache via PWA**
  - Assets e dados mais usados ficam em cache, reduzindo tempo de carregamento.
- **Testes com Jest + React Testing Library**
  - Asseguram que componentes, lógica de negócios e persistência funcionem corretamente em todas as situações.
- **Responsividade mobile-first**
  - Layouts adaptáveis de 360px a desktops, usando Flexbox e Grid para manter a interface fluida.

## 7. Conclusão e Resumo Geral

Este conjunto de tecnologias foi escolhido para entregar um aplicativo de tarefas que:

- **É rápido e responsivo** (Vite, PWA, Tailwind CSS)
- **Tem código organizado e seguro** (React, TypeScript, Zustand, testes automatizados)
- **Funciona offline e salva dados localmente** (Service Worker, localStorage)
- **Oferece interface moderna e agradável** (Atomic Design, ilustrações 3D, paleta de cores personalizada)
- **É fácil de desenvolver e manter** (GitHub, CI/CD, IDE com IA)

Com essa stack, garantimos uma experiência consistente para o usuário e uma base sólida para evoluções futuras.