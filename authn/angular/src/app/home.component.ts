import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthdogService } from "@authdog/angular";

@Component({
  selector: "app-home",
  imports: [RouterLink],
  template: `
    <main>
      <h1>authdog authentication (Angular)</h1>
      <p>
        Browser-only identity. This proves who the caller is; it is not a
        permission grant and the route guard is UX, not a security boundary.
      </p>
      <p>
        <button (click)="auth.signIn()">Sign in</button>
        <a routerLink="/profile">Profile</a>
      </p>
    </main>
  `,
})
export class HomeComponent {
  readonly auth = inject(AuthdogService);
}
