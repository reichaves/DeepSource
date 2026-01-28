# DeepSource | Workspace Investigativo

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Banner DeepSource" width="100%" />
  
  <p align="center">
    <strong>Uma ferramenta segura de jornalismo investigativo <em>client-side</em>, impulsionada pelo Gemini 3 Pro.</strong>
  </p>

  <p align="center">
    <a href="#funcionalidades">Funcionalidades</a> •
    <a href="#como-iniciar">Como Iniciar</a> •
    <a href="#protocolo-de-privacidade">Privacidade</a> •
    <a href="#origem-e-contexto">Origem e Contexto</a>
  </p>
</div>

---

## 🕵️‍♂️ Sobre o DeepSource

O **DeepSource** é um ambiente de trabalho especializado, projetado para jornalistas investigativos analisarem conjuntos de documentos, visualizarem conexões ocultas entre entidades e construírem linhas do tempo detalhadas.

Construído com uma estética "Cyber-Noir", o projeto prioriza a privacidade dos dados processando arquivos principalmente na sessão do navegador, utilizando o modelo **Google Gemini 3 Pro** apenas para a fase de raciocínio e extração de entidades.

### O Fluxo de Trabalho
1.  **Cofre de Evidências (Evidence Locker):** Upload de documentos em PDF, Texto ou Imagem.
2.  **Análise:** O sistema extrai automaticamente entidades (Pessoas, Organizações, Locais, Datas) usando IA.
3.  **Quadro de Investigação:** Visualize a rede de conexões entre documentos e entidades.
4.  **Linha do Tempo:** Explore uma visão cronológica dos eventos com trechos de contexto específicos.
5.  **Assistente:** Consulte o "Assistente DeepSource" para sintetizar informações cruzando todos os arquivos enviados.

---

## 🚀 Funcionalidades

*   **📄 Suporte Multi-Formato:** Arraste e solte arquivos de texto, PDFs e imagens.
*   **🧠 Extração via IA:** Utiliza o `gemini-3-pro-preview` para identificar entidades e normalizar datas (AAAA-MM-DD).
*   **🕸️ Grafo Interativo:** Um grafo de força dirigida (D3.js) para visualizar relacionamentos entre entidades e documentos de origem.
*   **📅 Linha do Tempo Contextual:** Não apenas datas, mas a frase/contexto específico onde a data aparece no documento.
*   **💬 Assistente Investigativo:** Uma interface de chat (RAG - Retrieval-Augmented Generation) para fazer perguntas sobre seus arquivos de caso específicos.
*   **🔒 Privacidade em Primeiro Lugar:** Sem banco de dados. Os dados são mantidos na memória do navegador e apagados ao atualizar a página.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** React 19, TypeScript, Vite
*   **Modelo de IA:** Google Gemini 3 Pro (via SDK `@google/genai`)
*   **Visualização:** D3.js (Data-Driven Documents)
*   **Estilização:** Tailwind CSS (Tema customizado "Cyber-Noir")
*   **Ícones:** Lucide React

---

## 🇧🇷 Origem e Contexto

Este projeto foi criado como parte de uma iniciativa da **Abraji (Associação Brasileira de Jornalismo Investigativo)** para estimular e aperfeiçoar o uso de IA no jornalismo.

*   **Fonte do Tutorial:** [Abraji Notícias](https://www.abraji.org.br/noticias/abraji-lanca-iniciativa-para-estimular-e-aperfeicoar-o-uso-de-ia-no-jornalismo)
*   **Metodologia:** Construído usando a função **"Build" do Google AI Studio** (Vibe Coding responsável).
*   **Vídeo Tutorial:** [Assista no YouTube](https://www.youtube.com/@Abraji_)

### O Prompt
A aplicação foi gerada utilizando um prompt em linguagem natural enfatizando um workspace seguro e *offline-first*, com uma estética específica e lógica funcional:

> *"Build a sophisticated, web-based investigative journalism tool called 'DeepSource'.
Core Purpose: A secure, offline-first workspace for journalists to upload document sets, visualize hidden connections between entities, and construct timelines.
Technical Stack:
Frontend: React (Functional Components with Hooks).
Styling: Tailwind CSS (Use a 'Cyber-Noir' aesthetic: deep grays, slate blues, and amber accents for data).
Icons: Lucide-React.
Data Handling: Client-side processing only (simulated NLP for this prototype).
User Interface & Layout:
Left Sidebar (Evidence Locker):
Upload Zone: Drag-and-drop area for files.
Entity Filters: Checkboxes to toggle visibility of specific entity types (e.g., 'Show People', 'Hide Locations', 'Show Organizations').
Export Data: A button to download the current investigation graph as a JSON or CSV file.
Main Dashboard (The Investigation Board):
Visual Canvas: Display extracted entities as interactive 'cards' or nodes.
Smart Linking: Draw lines between entities that appear in the same document.
Entity Details (Interaction): When a user clicks a node/card, open a floating panel showing:
Metadata: How many times this name appears.
Source: Which specific documents contain this entity.
Linking Options: A button to 'Manually Link' this entity to another.
Right Sidebar (The Assistant):
Chat Interface: A conversational UI to query the data.
'How It Works' Tab: A dedicated tab next to the chat. When clicked, display a detailed documentation view explaining:
The Workflow: How to upload and analyze.
The Tech: Explicitly state: 'This app is built using React, Tailwind CSS, and powered by the Gemini 3 Pro model.'
Privacy: Explain that data remains local to the browser session.
Bottom Panel (Contextual Timeline):
Timeline View: A horizontal scrollable timeline.
Context Enhancement: Do not just show the date. Show the date + the specific sentence/snippet where the date was found (e.g., 'Oct 12, 2023: Meeting arranged with CEO').
Functional Logic (Simulated for Prototype):
Since we are running client-side, use simple regex/logic to 'mock' the extraction of names and dates from text input to demonstrate the UI capabilities.
Ensure the 'Dark Mode' is the default and only theme.
Please write the complete, functional code for this application in a single file (or structured component blocks) so I can run it immediately."*

---

## 🏁 Como Iniciar

### Pré-requisitos
*   Node.js (v18 ou superior)
*   Uma Chave de API do Google Gemini (Obtenha em [aistudio.google.com](https://aistudio.google.com/))

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/deepsource.git
    cd deepsource
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave de API:
    ```env
    # Nota: No código, certifique-se de que a variável corresponde à chamada (ex: VITE_GEMINI_API_KEY)
    VITE_GEMINI_API_KEY=sua_chave_api_aqui
    ```

4.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```

5.  **Abra no Navegador:**
    Acesse `http://localhost:5173` (ou a porta indicada no seu terminal).

---

## 🛡️ Protocolo de Privacidade

O DeepSource foi desenhado tendo em mente a sensibilidade das investigações jornalísticas:

1.  **Sessão Local:** Os dados permanecem locais na sessão do seu navegador.
2.  **Análise Transitória:** Os documentos são enviados para a API do Gemini *apenas* durante o processo de análise/extração.
3.  **Sem Persistência:** Atualizar a página (F5) limpa completamente o cache da investigação. Nenhum dado é armazenado em servidores do DeepSource (pois não há banco de dados backend).

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

1.  Faça um Fork do projeto
2.  Crie sua Feature Branch (`git checkout -b feature/RecursoIncrivel`)
3.  Commit suas mudanças (`git commit -m 'Adiciona algum RecursoIncrivel'`)
4.  Push para a Branch (`git push origin feature/RecursoIncrivel`)
5.  Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.

---

<div align="center">
  <small>Powered by Google Gemini • Iniciativa da Abraji</small>
</div>
