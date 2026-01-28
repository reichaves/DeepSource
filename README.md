# DeepSource | Investigative Workspace

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="DeepSource Banner" width="100%" />
  
  <p align="center">
    <strong>A secure, client-side investigative journalism tool powered by Gemini 3 Pro.</strong>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#privacy-protocol">Privacy</a> •
    <a href="#origin--context">Origin & Context</a>
  </p>
</div>

---

## 🕵️‍♂️ About DeepSource

**DeepSource** is a specialized workspace designed for investigative journalists to analyze document sets, visualize hidden connections between entities, and construct timelines. 

Built with a "Cyber-Noir" aesthetic, it prioritizes data privacy by processing files primarily within the browser session, leveraging **Google's Gemini 3 Pro** model only for the extraction and reasoning phase.

### The Workflow
1.  **Evidence Locker:** Upload PDF, Text, or Image documents.
2.  **Analysis:** The system automatically extracts entities (People, Organizations, Locations, Dates) using AI.
3.  **Investigation Board:** Visualize the network of connections between documents and entities.
4.  **Timeline:** Explore a chronological view of events with specific context snippets.
5.  **Assistant:** Query the "DeepSource Assistant" to synthesize information across all uploaded files.

---

## 🚀 Features

*   **📄 Multi-Format Support:** Drag-and-drop support for text, PDFs, and images.
*   **🧠 AI-Powered Extraction:** Uses `gemini-3-pro-preview` to identify entities and normalize dates (YYYY-MM-DD).
*   **🕸️ Interactive Graph:** A force-directed graph (D3.js) to visualize relationships between entities and source documents.
*   **📅 Contextual Timeline:** Not just dates, but the specific context/sentence where the date appears.
*   **💬 Investigative Assistant:** A RAG-like (Retrieval-Augmented Generation) chat interface to ask questions about your specific case files.
*   **🔒 Privacy-First:** No database. Data is held in the browser's memory and cleared upon refresh.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **AI Model:** Google Gemini 3 Pro (via `@google/genai` SDK)
*   **Visualization:** D3.js (Data-Driven Documents)
*   **Styling:** Tailwind CSS (Custom "Cyber-Noir" theme)
*   **Icons:** Lucide React

---

## 🇧🇷 Origin & Context

This project was created as part of an initiative by **Abraji (Associação Brasileira de Jornalismo Investigativo)** to stimulate and refine the use of AI in journalism.

*   **Tutorial Source:** [Abraji News](https://www.abraji.org.br/noticias/abraji-lanca-iniciativa-para-estimular-e-aperfeicoar-o-uso-de-ia-no-jornalismo)
*   **Methodology:** Built using **Google AI Studio's "Build" feature** (Vibe Coding).
*   **Video Tutorial:** [Watch on YouTube](https://www.youtube.com/@Abraji_)

### The Prompt
The application was generated using a natural language prompt emphasizing a secure, offline-first workspace with a specific aesthetic and functional logic:

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

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   A Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/deepsource.git
    cd deepsource
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    # Note: In the code, this is accessed via process.env.API_KEY or import.meta.env depending on config
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```
    *(Note: Ensure `geminiService.ts` is configured to read the correct environment variable for your build tool).*

4.  **Run the application:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🛡️ Privacy Protocol

DeepSource is designed with the sensitivity of journalistic investigations in mind:

1.  **Local Session:** Data remains local to your browser session.
2.  **Transient Analysis:** Documents are sent to the Gemini API *only* for the duration of the analysis/extraction process.
3.  **No Persistence:** Refreshing the page clears the investigation cache completely. No data is stored on DeepSource servers (as there is no backend database).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <small>Powered by Google Gemini • Initiative by Abraji</small>
</div>
