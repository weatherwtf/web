import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";

import ko from "./locales/ko.json";
import en from "./locales/en.json";

const savedLang = Cookies.get("lang") || "ko";

i18n.use(initReactI18next).init({
    resources: {
        ko: { translation: ko },
        en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: "ko",
    interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
    Cookies.set("lang", lng, { expires: 365 });
});

export default i18n;
