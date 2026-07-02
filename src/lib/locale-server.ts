// 서버 컴포넌트에서 현재 로케일을 쿠키로부터 읽는다.
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" || value === "ko" ? value : DEFAULT_LOCALE;
}
