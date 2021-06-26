import { useContext } from "react"

import { LanguageContext, defaultLocale } from "./language-provider";
import { LangStrings } from "../assets/translation";

export default function useTranslation() {
  const [locale] = useContext(LanguageContext);

  function t(key: string) {
    if (!LangStrings[locale][key]) {
      console.warn(`No string '${key}' for locale '${locale}'`);
    }

    // @ts-ignore
    return LangStrings[locale][key] || LangStrings[defaultLocale][key] || "";
  }

  return { t, locale }
}
