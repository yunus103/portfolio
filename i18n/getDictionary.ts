import type { Locale } from './config'

const dictionaries = {
  tr: () => import('../dictionaries/tr.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
}

export const getDictionary = async (locale: Locale) => {
  return (dictionaries[locale] ?? dictionaries['tr'])()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
