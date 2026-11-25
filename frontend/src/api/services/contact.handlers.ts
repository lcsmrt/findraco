import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  Contact,
  ContactStatement,
  CreateContactRequest,
  Problem,
  ProblemType,
  UpdateContactRequest,
} from "../dtos";

type PlanParams = { planId: string };
type ContactParams = PlanParams & { id: string };

const base = "*/plan/:planId/contacts";

function problem(status: number, type: ProblemType): HttpResponse<Problem> {
  return HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status });
}

export const contactHandlers = {
  /** The list as asked: active contacts by default, with the archived ones when `archived=true`. */
  list(contacts: Contact[]): HttpHandler {
    return http.get<PlanParams, never, Contact[]>(base, () => HttpResponse.json(contacts));
  },
  /** Answers each request by its `archived` query, as the API does: the two lists are told apart. */
  listByArchived(active: Contact[], withArchived: Contact[]): HttpHandler {
    return http.get<PlanParams, never, Contact[]>(base, ({ request }) =>
      HttpResponse.json(new URL(request.url).searchParams.get("archived") === "true" ? withArchived : active),
    );
  },
  statement(statement: ContactStatement): HttpHandler {
    return http.get<ContactParams, never, ContactStatement>(`${base}/:id/statement`, () =>
      HttpResponse.json(statement),
    );
  },
  statementError(status = 500): HttpHandler {
    return http.get<ContactParams, never, Problem>(`${base}/:id/statement`, () => problem(status, "internal"));
  },
  create(contact: Contact): HttpHandler {
    return http.post<PlanParams, CreateContactRequest["body"], Contact>(base, () =>
      HttpResponse.json(contact, { status: 201 }),
    );
  },
  createRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<PlanParams, CreateContactRequest["body"], Problem>(base, () => problem(status, type));
  },
  rename(contact: Contact): HttpHandler {
    return http.put<ContactParams, UpdateContactRequest["body"], Contact>(`${base}/:id`, () =>
      HttpResponse.json(contact),
    );
  },
  archive(contact: Contact): HttpHandler {
    return http.post<ContactParams, never, Contact>(`${base}/:id/archive`, () => HttpResponse.json(contact));
  },
  archiveRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<ContactParams, never, Problem>(`${base}/:id/archive`, () => problem(status, type));
  },
  unarchive(contact: Contact): HttpHandler {
    return http.post<ContactParams, never, Contact>(`${base}/:id/unarchive`, () => HttpResponse.json(contact));
  },
  unarchiveRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<ContactParams, never, Problem>(`${base}/:id/unarchive`, () => problem(status, type));
  },
  remove(): HttpHandler {
    return http.delete<ContactParams>(`${base}/:id`, () => new HttpResponse(null, { status: 204 }));
  },
  removeRejected(status: number, type: ProblemType): HttpHandler {
    return http.delete<ContactParams, never, Problem>(`${base}/:id`, () => problem(status, type));
  },
};
