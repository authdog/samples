/**
 * In-memory step-up marks. NOT durable — use a datastore in production.
 *
 * A mark means: "this subject tripped a security-relevant event; require a
 * step-up challenge before the next sensitive action." Per the Lidar recipe,
 * challenge — don't block outright.
 */
const markedSubjects = new Set();

export function markForStepUp(subject) {
  markedSubjects.add(subject);
}

export function requiresStepUp(subject) {
  return markedSubjects.has(subject);
}

export function clearStepUp(subject) {
  markedSubjects.delete(subject);
}

/** Extract the subject from a verified event payload. */
export function eventSubject(event) {
  return event?.data?.user?.id ?? event?.data?.subject ?? null;
}
