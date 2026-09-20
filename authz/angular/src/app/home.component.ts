import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthdogService } from "@authdog/angular";

@Component({
  selector: "app-home",
  imports: [RouterLink],
  template: `
    <main>
      <h1>authdog authorization (Angular)</h1>
      <p>
        Browser-only permission <em>hint</em>. Showing or hiding UI is not a
        security boundary — enforce access on a backend.
      </p>
      <p>
        <button (click)="auth.signIn()">Sign in</button>
        <a routerLink="/invoices">Invoices</a>
      </p>
    </main>
  `,
})
export class HomeComponent {
  readonly auth = inject(AuthdogService);
}
