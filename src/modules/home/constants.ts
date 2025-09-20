export const PROJECT_TEMPLATES = [
  {
    emoji: "🎬",
    title: "Build a Netflix clone",
    prompt:
      "Build a Netflix-style homepage with a hero banner using dark gradients, movie sections with horizontal scrolling, responsive movie cards, and a detailed modal for viewing movie information. Use mock movie data with titles, descriptions, and placeholder images (colored divs with aspect-video). Include navigation header with search bar. Implement all interactions with React state (useState). Use dark mode throughout. Make it fully responsive and interactive.",
  },
  {
    emoji: "📦",
    title: "Build an admin dashboard",
    prompt:
      "Create a complete admin dashboard with collapsible sidebar navigation, main content area with stat cards showing metrics, data tables with sorting and filtering, and chart placeholders using colored divs. Include user profile dropdown in header. Use mock data for all statistics and tables. Implement all interactions with React state. Use professional color scheme with proper spacing and modern design. Make it fully responsive.",
  },
  {
    emoji: "📋",
    title: "Build a kanban board",
    prompt:
      "Build a fully functional kanban board with columns (To Do, In Progress, Done), drag-and-drop functionality using react-beautiful-dnd library (install it first), and the ability to add, edit, and delete tasks. Use React state to manage all task data. Include task filtering and search functionality. Use consistent card design with proper spacing and hover effects. Make it responsive and polished.",
  },
  {
    emoji: "🗂️",
    title: "Build a file manager",
    prompt:
      "Build a complete file manager interface with folder tree sidebar, main file grid view, breadcrumb navigation, and context menus for file operations (rename, delete, copy). Use mock folder/file data with different file types. Include file search and sorting options. Implement all functionality with React state. Use proper file type icons and visual distinction between folders and files. Make it fully interactive and responsive.",
  },
  {
    emoji: "📺",
    title: "Build a YouTube clone",
    prompt:
      "Build a YouTube-style video platform with header containing search bar and user menu, sidebar with categories and subscriptions, main video grid with thumbnails (use colored divs with aspect-video), and video detail modal with comments section. Use mock video data including titles, channels, view counts, and upload dates. Implement video search and category filtering with React state. Make it fully responsive and interactive.",
  },
  {
    emoji: "🛍️",
    title: "Build a store page",
    prompt:
      "Build a complete e-commerce store with product grid, category sidebar filters, search functionality, shopping cart with add/remove items, and product detail modals. Use mock product data with prices, descriptions, and placeholder images (colored divs). Implement cart state management, quantity controls, and checkout flow. Include price filtering and sorting options. Use modern e-commerce design patterns with proper spacing and button states.",
  },
  {
    emoji: "🏡",
    title: "Build an Airbnb clone",
    prompt:
      "Build an Airbnb-style property listing platform with search header, filter sidebar (price, location, amenities), property grid with cards showing images (colored divs with aspect-video), and detailed property modal with booking calendar. Use mock property data including prices, locations, ratings, and amenities. Implement all filtering and search with React state. Include map placeholder and booking functionality. Make it fully responsive with clean card design.",
  },
  {
    emoji: "🎵",
    title: "Build a Spotify clone",
    prompt:
      "Build a Spotify-style music player with sidebar containing playlists and navigation, main content area showing albums/playlists, search functionality, and bottom playback controls with play/pause, progress bar, and volume control. Use mock music data including song titles, artists, and album covers (colored divs with aspect-square). Implement playlist creation, song queue management, and playback state with React state. Use dark theme throughout. Make it fully functional and responsive.",
  },
] as const;