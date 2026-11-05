# Actual vs Forecast (Recurrence v3) Context

**Gathered:** 2026-11-05
**Spec:** `.specs/features/actual-vs-forecast/spec.md`
**Status:** Discussing

---

## Feature Boundary

Tell planned transactions from realised ones. Today every series occurrence is a plain transaction, so a bill due on the 20th already counts as spent on the 5th. This feature marks what is still forecast and shows both figures, for expenses and income.

---

## Implementation Decisions

### When a forecast becomes actual

- A flag on the transaction decides it (user, 2026-11-05: "Acho que tem que ter uma flag na transação. Não me importo com assinaturas, por exemplo, mas tem casos que o valor e variável e gosto de ir lá e editar com o valor real.").
- Fixed amounts (subscriptions): no action needed. Variable amounts: the user edits the occurrence with the real value.
- The flag lives on the series (installment or recurring), set when creating or editing it; every occurrence inherits it and keeps its own confirmed state (user, 2026-11-05: "5. A").
- The flag is a boolean, "requires manual confirmation", and defaults to on; off means the occurrence becomes actual on its date (user, 2026-11-05: "Não existe \"sem a flag\", pois entendo que seria booleana, certo? Comportamento padrão pode ser exigir confirmação manual").
- An occurrence that requires confirmation and whose date has passed stays forecast, is highlighted as pending and counts in the forecast total, not the actual one (user, 2026-11-05: "7. A").
- A "Confirm" action on the occurrence opens a small dialog with the forecast amount and date filled in; confirming makes it actual, with the values as edited (user, 2026-11-05: "6 A, mas isso de editar = confirmar pode causar confusão. O usuário pode acabar sendo pego de surpresa por um comportamento não óbvio. Não significa que não devemos implementar, mas sim que temos que ter uma boa UI/UX aqui."). How the full edit form confirms must be explicit, never a side effect of saving.
- The edit form of an occurrence that requires confirmation shows a "Status: Forecast · Actual" control, preset to its current state; saving keeps what it shows, and the same control undoes a wrong confirmation (user, 2026-11-05: "11 A").
- Existing data: past occurrences become actual; existing series get the flag off (behaviour unchanged); only new series default to on (user, 2026-11-05: "10 A").
- A one-off transaction dated in the future is forecast until its date, then actual (user, 2026-11-05: "9. A").

### Month summary

- Forecast and actual shown side by side, for income as well as expenses (user, 2026-11-05: "Previsto e realizado, não só de gasto, mas de receita também.").

### Category spending limits

- Unchanged in this feature: the categories UI will be redone later, so changing it now would be rework (user, 2026-11-05: "Aqui eu não mexeria agora, pois é mais visual, certo? Eu pretendo refazer a UI dessa parte de categorias futuramente, seria retrabalho.").

---

## Specific References

- Organizze / Mobills "efetivada" status (agent's reference, offered in the discussion).

---

## Deferred Ideas

- Matching an imported CSV row to its forecast occurrence (reconciliation): its own feature (user, 2026-11-05: "Fora do escopo, pode ser.").
- Forecast shown in the category limit bars: with the categories UI redesign.
