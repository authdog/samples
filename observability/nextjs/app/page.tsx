export default function Home() {
  return (
    <main>
      <h1>authdog observability (Next.js)</h1>
      <p>
        This starter consumes the identity event stream. It does not run
        detectors — that is Lidar, in the console.
      </p>
      <ul>
        <li>
          <code>POST /api/webhooks/authdog</code> — signed webhook receiver
        </li>
        <li>
          <code>GET /api/events</code> — first page of the Events API plus the
          cursor
        </li>
      </ul>
    </main>
  );
}
