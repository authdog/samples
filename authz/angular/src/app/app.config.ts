import type { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { provideAuthdog, authdogInterceptor } from "@authdog/angular";
import { routes } from "./app.routes";
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authdogInterceptor])),
    provideAuthdog({
      publicKey: environment.authdogPublicKey,
      loginPath: "/",
    }),
  ],
};
