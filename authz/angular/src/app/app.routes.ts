import type { Routes } from "@angular/router";
import { authdogGuard } from "@authdog/angular";
import { HomeComponent } from "./home.component";
import { InvoicesComponent } from "./invoices.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "invoices", component: InvoicesComponent, canActivate: [authdogGuard] },
];
