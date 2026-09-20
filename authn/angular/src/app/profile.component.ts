import { Component, computed, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthdogService } from "@authdog/angular";

@Component({
  selector: "app-profile",
  imports: [RouterLink],
  template: `
    <main>
      @if (auth.isLoading()) {
        <p>Loading…</p>
      } @else if (email(); as email) {
        <p>Signed in as {{ email }}</p>
        <p>
          <a routerLink="/">Home</a>
          <button (click)="auth.signOut()">Sign out</button>
        </p>
      } @else {
        <p>Not signed in.</p>
        <p><a routerLink="/">Home</a></p>
      }
    </main>
  `,
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthdogService);

  readonly email = computed(() => {
    const user = this.auth.user() as {
      emails?: { value?: string }[];
    } | null;
    return user?.emails?.[0]?.value ?? null;
  });

  async ngOnInit() {
    await this.auth.fetchUser();
  }
}
