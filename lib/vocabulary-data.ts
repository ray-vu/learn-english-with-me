export interface Topic {
  id: string;
  title: string;
  titleVi: string;
  icon: string;
  gradient: string;
}

export const topics: Topic[] = [
  // ── Original 8 ──────────────────────────────────────────────────────────────
  { id: "animals",    title: "Animals",       titleVi: "Động vật",     icon: "🐾", gradient: "from-emerald-400 to-teal-600"    },
  { id: "food",       title: "Food & Drinks", titleVi: "Ẩm thực",      icon: "🍜", gradient: "from-orange-400 to-red-500"      },
  { id: "technology", title: "Technology",    titleVi: "Công nghệ",    icon: "💻", gradient: "from-blue-400 to-indigo-600"     },
  { id: "travel",     title: "Travel",        titleVi: "Du lịch",      icon: "✈️", gradient: "from-sky-400 to-cyan-600"        },
  { id: "business",   title: "Business",      titleVi: "Kinh doanh",   icon: "📊", gradient: "from-violet-400 to-purple-600"   },
  { id: "health",     title: "Health",        titleVi: "Sức khỏe",     icon: "💪", gradient: "from-rose-400 to-pink-600"       },
  { id: "nature",     title: "Nature",        titleVi: "Thiên nhiên",  icon: "🌿", gradient: "from-lime-400 to-green-600"      },
  { id: "emotions",   title: "Emotions",      titleVi: "Cảm xúc",      icon: "💭", gradient: "from-yellow-400 to-amber-500"    },
  // ── New 10 ──────────────────────────────────────────────────────────────────
  { id: "sports",     title: "Sports",        titleVi: "Thể thao",     icon: "🏃", gradient: "from-green-400 to-emerald-600"   },
  { id: "science",    title: "Science",       titleVi: "Khoa học",     icon: "🔬", gradient: "from-cyan-400 to-blue-600"       },
  { id: "arts",       title: "Arts",          titleVi: "Nghệ thuật",   icon: "🎨", gradient: "from-pink-400 to-rose-600"       },
  { id: "music",      title: "Music",         titleVi: "Âm nhạc",      icon: "🎵", gradient: "from-violet-500 to-purple-700"   },
  { id: "education",  title: "Education",     titleVi: "Giáo dục",     icon: "🎓", gradient: "from-indigo-400 to-blue-600"     },
  { id: "fashion",    title: "Fashion",       titleVi: "Thời trang",   icon: "👗", gradient: "from-fuchsia-400 to-pink-600"    },
  { id: "finance",    title: "Finance",       titleVi: "Tài chính",    icon: "💰", gradient: "from-green-500 to-teal-600"      },
  { id: "psychology", title: "Psychology",    titleVi: "Tâm lý học",   icon: "🧠", gradient: "from-purple-400 to-violet-600"   },
  { id: "space",      title: "Space",         titleVi: "Vũ trụ",       icon: "🚀", gradient: "from-slate-600 to-indigo-800"    },
  { id: "law",        title: "Law",           titleVi: "Pháp luật",    icon: "⚖️", gradient: "from-slate-400 to-gray-600"      },
];
