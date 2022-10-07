import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FeatureFlagLoader, FeatureFlagModule } from 'ngx-feature-flags';
import { of } from 'rxjs';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FeatureFlagModule.forRoot({
      loader: {
        provide: FeatureFlagLoader,
        useValue: {
          getFeatureFlags: () =>
            of({
              FeatureA: true,
              FeatureB: false,
            }),
        },
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
