/**
 * In-memory step-up marks. NOT durable — use a datastore in production.
 *
 * A mark means: "this subject tripped a security-relevant event; require a
 * step-up challenge before the next sensitive action." Per the Lidar recipe,
 * challenge — don't block outright.
 */
const markedSubjects = new Set<string>();

export function markForStepUp(subject: string): void {
  markedSubjects.add(subject);
}

export function requiresStepUp(subject: string): boolean {
  return markedSubjects.has(subject);
}

export function clearStepUp(subject: string): void {
  markedSubjects.delete(subject);
}

/** Extract the subject from a verified event payload. */
export function eventSubject(event: Record<string, unknown>): string | null {
  const data = event.data as Record<string, unknown> | undefined;
  const user = data?.user as Record<string, unknown> | undefined;
  return (
    (user?.id as string | undefined) ??
    (data?.subject as string | undefined) ??
    null
  );
}
