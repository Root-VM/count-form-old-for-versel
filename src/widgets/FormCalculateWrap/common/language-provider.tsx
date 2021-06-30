import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const defaultLocale = "en";
export const locales = ["de", "en"];
export const LanguageContext = createContext([]);

export const LanguageProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const router = useRouter();

  useEffect(() => {
    setLocale(router.query?.lang === 'de' ? 'de' : 'en');
  }, [router]);

  return (
    // @ts-ignore
    <LanguageContext.Provider value={[locale, setLocale]}>
      {children}
    </LanguageContext.Provider>
  )
};
