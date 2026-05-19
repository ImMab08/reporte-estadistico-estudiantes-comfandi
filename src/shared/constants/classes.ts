import { IconFunction, IconAutoStories, IconComputer, IconPottedPlant, IconAntigravity, IconEmojiLanguage } from "@/src/shared/icons";

export const days = [
  { name: "Lunes" },
  { name: "Martes" },
  { name: "Miércoles" },
  { name: "Jueves" },
  { name: "Viernes" },
];

export const blocks = [
  { label: "1H", time: "6:30 - 7:25" },
  { label: "2H", time: "7:25 - 8:20" },
  { label: "3H", time: "8:20 - 9:15" },
  { label: "BREAK", time: "9:15 - 9:45", type: "break" },
  { label: "4H", time: "9:45 - 10:40" },
  { label: "5H", time: "10:40 - 11:35" },
  { label: "LUNCH", time: "11:35 - 12:30", type: "lunch" },
  { label: "6H", time: "12:30 - 1:25" },
  { label: "7H", time: "1:25 - 2:20" },
  { label: "8H", time: "2:20 - 3:15" },
];

export const subjectConfig = {
  Matemáticas: {
    color: "bg-blue-50 border-blue-200 text-blue-700",
    icon: IconFunction,
  },

  Tecnología: {
    color: "bg-teal-50 border-teal-200 text-teal-700",
    icon: IconComputer,
  },

  "Cs. Naturales": {
    color: "bg-green-50 border-green-200 text-green-700",
    icon: IconPottedPlant,
  },

  Física: {
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    icon: IconAntigravity,
  },

  Química: {
    color: "bg-pink-50 border-pink-200 text-pink-700",
    icon: IconAntigravity,
  },

  "Cs. Sociales": {
    color: "bg-amber-50 border-amber-200 text-amber-700",
    icon: IconAutoStories,
  },

  Inglés: {
    color: "bg-sky-50 border-sky-200 text-sky-700",
    icon: IconEmojiLanguage,
  },

  "Lengua Castellana": {
    color: "bg-orange-50 border-orange-200 text-orange-700",
    icon: IconAutoStories,
  },

  Filosofía: {
    color: "bg-purple-50 border-purple-200 text-purple-700",
    icon: IconAutoStories,
  },

  Ética: {
    color: "bg-rose-50 border-rose-200 text-rose-700",
    icon: IconAutoStories,
  },

  Religión: {
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    icon: IconAutoStories,
  },

  Emprendimiento: {
    color: "bg-lime-50 border-lime-200 text-lime-700",
    icon: IconAutoStories,
  },

  Música: {
    color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
    icon: IconAutoStories,
  },

  Artes: {
    color: "bg-violet-50 border-violet-200 text-violet-700",
    icon: IconAutoStories,
  },

  "Edu. Física": {
    color: "bg-red-50 border-red-200 text-red-700",
    icon: IconAutoStories,
  },

  Cátedra: {
    color: "bg-slate-100 border-slate-200 text-slate-700",
    icon: IconAutoStories,
  },

  Homeroom: {
    color: "bg-gray-100 border-gray-200 text-gray-700",
    icon: IconAutoStories,
  },
} as const;