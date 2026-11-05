# Internationalisation (M5-10) Context

**Gathered:** 2026-11-05
**Spec:** `.specs/features/i18n/spec.md`
**Status:** Ready for spec

---

## Feature Boundary

The interface can be used in Brazilian Portuguese: every UI text translated, dates and numbers formatted for the viewer. Data the users type (category names, descriptions, plan names) is never translated. Why now (user, 2026-11-05): his wife struggles to use the app in English.

---

## Implementation Decisions

### Languages

- Brazilian Portuguese (`pt-BR`) and English (`en`); English stays the source language (user, 2026-11-05: "pt-br e ingles po, obviamente").

### How the language is chosen

- First visit: the device language. A "Language / Idioma" control in the profile menu changes it, saved on the user's account like the time zone (`User`, `TimeZoneDialog` pattern), so it follows the user across devices. Before sign-in (login, sign-up, password pages) the device language applies (user, 2026-11-05: "auto + troca via config").

### Server-sent text

- The only server-sent text is the password reset e-mail (`EmailService.java:61`); CSV and error copy already live in the frontend (`problems.ts`).
- The e-mail goes out in the account's saved language; with none saved, in the language of the page that asked (sent with the request). The user asked for the market pattern (2026-11-05: "temos que seguir o padrão de mercado"); account preference with the request's language as fallback is the common pattern for transactional e-mail (agent's reading, not checked against a cited source).

### Formats

- Money stays as today, `R$ 1.234,56`, in both languages: currency is data, not language (user, 2026-11-05: "isso não é linguagem e sim moeda").
- Dates: text follows the chosen language, the date format follows the device region (`Intl.Locale(language, { region })`): English on a Brazilian device writes 04/11/2026, on a US device 11/04/2026. The market pattern keeps language and regional format separate (user confirmed 2026-11-05: "Ok ... Pode seguir").

---

## Deferred Ideas

- A separate "region / format" preference, and a user-chosen date format on top of it (user, 2026-11-05: "futuramente deixar a pessoa escolher o formato de data certinho que ela prefere").

