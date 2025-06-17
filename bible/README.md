# 📖 Bible.ai

<div align="center">

![Bible.ai Logo](public/bible.png)

**A Modern, AI-Powered Bible Reading Experience**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.3%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🚀 Live Demo](https://bible-ai.vercel.app) • [📚 Documentation](docs/) • [🐛 Report Bug](https://github.com/Rais-th/Bible.ai/issues)

</div>

---

## ✨ Features

### 🌍 **Multi-Language Support**
- 📖 **5 Bible Translations**: English (WEB), French (LSG), Swahili (SWA), Lingala (LIN), Shi (SHI)
- 🔄 Dynamic UI language switching with localized book names
- 💾 Persistent reading position across translations

### 📱 **Mobile-First Experience**
- 🎨 **Glass Morphism Design**: Modern UI with backdrop blur effects
- 📺 **TikTok-Style Shorts**: Social media inspired Bible content discovery
- 🌓 **Adaptive Theming**: Light/Dark mode with nebula backgrounds
- 📐 **Responsive Design**: Optimized for all screen sizes

### 🤖 **AI-Powered Features**
- 🎯 **Smart Verse Suggestions**: Natural language queries for relevant Bible verses
- 🧠 **AI Explanations**: Theological insights and practical applications
- ⚡ **Instant Lookup**: Fast in-memory verse retrieval system

### 🎭 **User Experience**
- 🔖 **Reading Memory**: Automatic position saving with localStorage
- 🔤 **Font Controls**: Customizable reading experience (12px-32px)
- 🎪 **Smooth Animations**: Framer Motion powered transitions
- 📊 **Progress Tracking**: Chapter navigation with visual indicators

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | AI & APIs | Styling |
|----------|---------|-----------|---------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js) | ![OpenRouter](https://img.shields.io/badge/-OpenRouter-FF6B6B?style=flat-square) | ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css) |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react) | ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript) | ![API.Bible](https://img.shields.io/badge/-API.Bible-4A90E2?style=flat-square) | ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square) |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat-square) | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel) | ![Mistral AI](https://img.shields.io/badge/-Mistral%20AI-FF7000?style=flat-square) | ![Shadcn/UI](https://img.shields.io/badge/-Shadcn/UI-000000?style=flat-square) |

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites

- ![Node.js](https://img.shields.io/badge/-Node.js%2018+-339933?style=flat-square&logo=node.js) 
- ![npm](https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm) or ![yarn](https://img.shields.io/badge/-yarn-2C8EBB?style=flat-square&logo=yarn)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rais-th/Bible.ai.git
   cd Bible.ai/bible
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   NEXT_PUBLIC_API_BIBLE_KEY=your_api_bible_key
   NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
   GOOGLE_API_KEY=your_google_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:9002` 🎉

---

## 📱 App Architecture

### 🏗️ **Component Structure**

```
📦 Bible.ai
├── 🎯 Core Reading Experience
│   ├── 📱 BibleReaderMobile (Full-screen glass morphism)
│   ├── 💻 BibleReaderDesktop (Traditional layout)
│   └── 🔄 BibleReader (Responsive wrapper)
├── 📺 Shorts Feature
│   ├── 📱 ShortsMobile (TikTok-style interface)
│   ├── 💻 ShortsDesktop (Grid layout)
│   └── 🎬 Shorts (Main component)
└── 🤖 AI Integration
    ├── 🎯 Verse Suggestions
    ├── 💡 Explanations
    └── 🔍 Smart Search
```

### 🔄 **Data Flow**

```mermaid
graph TD
    A[User Input] --> B[BibleService]
    B --> C[API.Bible]
    B --> D[OpenRouter AI]
    B --> E[Local Storage]
    C --> F[Verse Content]
    D --> G[AI Suggestions]
    E --> H[User Preferences]
    F --> I[UI Rendering]
    G --> I
    H --> I
```

---

## 🎨 Design System

### 🌈 **Glass Morphism Elements**
- **Content Cards**: `bg-black/30 dark:bg-black/40 backdrop-blur-xl`
- **Navigation Pills**: `bg-white/80 dark:bg-neutral-800/60 backdrop-blur-lg`
- **Floating Buttons**: `bg-white/10 hover:bg-white/20 backdrop-blur-sm`

### 📐 **Responsive Breakpoints**
- **xs**: Extra small screens (custom breakpoint)
- **sm**: Small screens (640px+)
- **md**: Medium screens (768px+) - Desktop layout switch
- **lg+**: Large screens with enhanced spacing

---

## 🔌 API Integration

### 📖 **Bible Content (API.Bible)**
- **Primary Source**: `scripture.api.bible`
- **5 Translations**: Multi-language support
- **HTML Parsing**: Advanced verse extraction
- **Fallback System**: `bible-api.com` backup

### 🤖 **AI Features (OpenRouter)**
- **Model**: `mistralai/mistral-7b-instruct:free`
- **Structured Output**: JSON schema validation with Zod
- **Smart Prompting**: Context-aware verse suggestions
- **Explanation Engine**: Theological insights generator

---

## 📊 Performance Features

- ⚡ **In-Memory Lookup**: Fast verse retrieval with KJV_DATA
- 🎯 **Optimized Parsing**: Efficient HTML content processing
- 💾 **Smart Caching**: localStorage for user preferences
- 📱 **Mobile Optimized**: Hidden scrollbars and smooth animations
- 🔄 **Lazy Loading**: On-demand chapter loading

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
- Use the [issue tracker](https://github.com/Rais-th/Bible.ai/issues)
- Include browser/device information
- Provide steps to reproduce

### ✨ **Feature Requests**
- Check existing [issues](https://github.com/Rais-th/Bible.ai/issues) first
- Provide detailed use cases
- Consider backwards compatibility

### 🔧 **Development**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🛣️ Roadmap

### 🎯 **Phase 1** (Current)
- [x] Multi-language Bible reading
- [x] AI-powered verse suggestions
- [x] Mobile-first glass morphism design
- [x] TikTok-style Shorts feature

### 🚀 **Phase 2** (Upcoming)
- [ ] 🎧 Audio Bible integration
- [ ] 📝 Verse highlighting & annotations
- [ ] 👥 User accounts & sync
- [ ] 📚 Reading plans

### 🌟 **Phase 3** (Future)
- [ ] 🔍 Advanced search functionality
- [ ] 📖 Cross-references & study tools
- [ ] 📱 PWA & offline reading
- [ ] 🌐 Community features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 📖 **API.Bible** for comprehensive Bible content
- 🤖 **OpenRouter** for AI capabilities
- 🎨 **Shadcn/UI** for beautiful components
- 🌟 **The open-source community** for inspiration

---

<div align="center">

**Built with ❤️ by [Rais-th](https://github.com/Rais-th)**

[⭐ Star this repo](https://github.com/Rais-th/Bible.ai) • [🐛 Report Issues](https://github.com/Rais-th/Bible.ai/issues) • [💬 Discussions](https://github.com/Rais-th/Bible.ai/discussions)

</div>
