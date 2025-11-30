🤖 AI Chatbot Assistant (Next.js + Gemini API)

An intelligent and interactive AI Chatbot Assistant built using Next.js, powered by Google Gemini API, and styled beautifully with Tailwind CSS.
The chatbot supports multiple personas, voice input, image and file message support, providing a smart and modern AI chat experience.

🚀 Features


⚡ Gemini AI Integration – Powered by Google’s Gemini model for natural and multimodal conversations.

📄 File Upload – Share files (PDFs, docs, etc.) for AI analysis and responses.

💬 Real-Time Chat UI – Smooth and responsive chat experience.

🆕 New Chat – Start a fresh conversation at any time.

📋 Copy Responses – Quickly copy AI replies with one click.


✨ Optimistic UI Updates – Smooth transitions and loading animations.

🧩 Next.js API Routes – Secure server-side communication.

📦 pnpm Support – Fast and efficient package management.

🧱 Tech Stack
## Technology	Purpose
Next.js 14+	Full-stack framework (Frontend + API routes)
React 18	Frontend UI logic
TypeScript	Type safety
Tailwind CSS	Styling
Google Gemini API	AI text + image generation
pnpm	Dependency management
📂 Folder Structure
ai-chatbot-assistant/
│
├─ app/                  # Next.js app folder (pages or app router)
│  ├─ api/               # Server-side API routes
│  ├─ components/        # Reusable UI components
│  └─ styles/            # Tailwind CSS or global styles
│
├─ public/               # Static assets (images, icons)
├─ utils/                # Utility functions (API handlers, helpers)
├─ types/                # TypeScript type definitions
└─ package.json

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/yourusername/ai-chatbot-assistant.git
cd ai-chatbot-assistant

2️⃣ Install dependencies
pnpm install

3️⃣ Configure environment variables

Create a .env.local file in the root folder:

GEMINI_API_KEY=your_google_gemini_api_key_here

4️⃣ Run the development server
pnpm dev


5️⃣ Access the app

Open http://localhost:3000 in your browser.

📝 Usage

Start a Chat: Select an AI persona and start messaging.


File Upload: Click the file icon to send PDFs, Word docs, etc.

New Chat: Click the “New Chat” button to reset conversation.

Copy Responses: Click the copy icon next to AI replies.

