import { Component, computed, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthdogService } from "@authdog/angular";

const REQUIRED_PERMISSION = "invoices:read";

@Component({
  selector: "app-invoices",
  imports: [RouterLink],
  template: `
    <main>
      <h1>Invoices</h1>
      @if (auth.isLoading()) {
        <p>Loading…</p>
      } @else if (canRead()) {
        <ul>
          <li>inv_001 — 1200 (paid)</li>
          <li>inv_002 — 340 (open)</li>
        </ul>
      } @else {
        <p>You don't have <code>invoices:read</code>. Panel hidden.</p>
      }
      <p>
        <a routerLink="/">Home</a>
        <button (click)="auth.signOut()">Sign out</button>
      </p>
    </main>
  `,
})
export class InvoicesComponent implements OnInit {
  readonly auth = inject(AuthdogService);

  // UI hint only — enforcement belongs on a backend.
  readonly canRead = computed(() => {
    const user = this.auth.user() as { permissions?: string[] } | null;
    const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
    return permissions.includes(REQUIRED_PERMISSION);
  });

  async ngOnInit() {
    await this.auth.fetchUser();
  }
}
