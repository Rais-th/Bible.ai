# **App Name**: Bible AI

## Core Features:

- Landing Page: Landing page for the app
- Search Bar: Display a clean, user-friendly search bar for user queries.
- AI Verse Selection: Utilize AI as a tool to interpret user queries and return a list of relevant bible verses. This AI component will only be responsible for returning the references; the verses will be looked up locally.
- Interactive Verse Cards: Display Bible verses in interactive card formats.
- Day/Night Mode Switch: Implement a day/night mode switch for user preference.

## Style Guidelines:

- Fond & Ambiance: La base est bg-black text-white. Pour créer une ambiance dynamique, ajoute deux div décoratives en position: absolute avec les classes blur-3xl et animate-pulse, simulant une nébuleuse animée en arrière-plan.
- Typographie: Utilise la police "Inter". Le titre principal "Bible.ai" doit être font-light et utiliser un gradient pour un éclat métallique : bg-gradient-to-r from-white via-gray-300 to-white, combiné à bg-clip-text text-transparent.
- Effet "Glassmorphism": Applique précisément ce style aux éléments flottants.
- Barre de recherche: bg-white/10, backdrop-blur-md, border border-white/20, et rounded-2xl. L'input à l'intérieur doit être bg-transparent.
- Boutons de suggestion: Des pilules stylisées avec bg-white/5, border-white/10, rounded-full et un hover:bg-white/10.
- Cartes de Versets (VerseCard): Ces cartes ne sont pas en verre. Elles utilisent un fond solide et sombre, mais distinct de l'arrière-plan de la page (ex: bg-white/5 mais sans backdrop-blur), et des coins très arrondis (rounded-2xl ou rounded-3xl).
- Dispose-les dans une grid qui devient md:grid-cols-2 sur les écrans moyens.
- Modal d'Explication IA: Il doit flouter tout l'arrière-plan de la page quand il est actif. Le modal lui-même est grand, avec des coins très arrondis (rounded-3xl) et un fond solide et opaque (ex: bg-gray-900). Le contenu doit être structuré par catégories avec des titres et des icônes.
- Animations (Framer Motion): Les éléments principaux de la page doivent apparaître avec initial={{ opacity: 0, y: 20 }} et animate={{ opacity: 1, y: 0 }}. Les éléments interactifs comme les boutons et les cartes doivent avoir une réaction au survol, par exemple : whileHover={{ scale: 1.05 }}.