import { defaultLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import NotFoundComponent from '@/components/sections/NotFound'

export default async function GlobalNotFound() {
  const dict = await getDictionary(defaultLocale)

  return (
    <div className="flex flex-col min-h-screen">
      {/* We don't have Locale here for Header/Footer easily without headers() hack, 
          so we just render the component which has the logic */}
      <NotFoundComponent dict={dict} />
    </div>
  )
}
