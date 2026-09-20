import type { Routes } from "@angular/router";
import { authdogGuard } from "@authdog/angular";
import { HomeComponent } from "./home.component";
import { ProfileComponent } from "./profile.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "profile", component: ProfileComponent, canActivate: [authdogGuard] },
];
