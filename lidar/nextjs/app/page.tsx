export default function Home() {
  return (
    <main>
      <h1>authdog lidar (Next.js)</h1>
      <p>
        This starter reacts to security-relevant identity events with a
        step-up challenge. Lidar Signals live in the console — there is no
        public Signals API.
      </p>
      <ul>
        <li>
          <code>POST /api/webhooks/authdog</code> — verified receiver that
          marks the subject
        </li>
        <li>
          <code>GET /api/sensitive</code> — 428 challenge when marked
        </li>
        <li>
          <code>POST /api/step-up/complete</code> — clears the mark
        </li>
      </ul>
    </main>
  );
}
