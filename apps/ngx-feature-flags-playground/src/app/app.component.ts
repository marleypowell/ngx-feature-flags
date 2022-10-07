import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureFlagService } from 'ngx-feature-flags';
import { map } from 'rxjs';

@Component({
  selector: 'ngx-feature-flags-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly featureFlags$ = this.featureFlagService.featureFlags$.pipe(
    map((featureFlags) => Object.entries(featureFlags))
  );

  public constructor(private featureFlagService: FeatureFlagService) {}

  public updateFeatureFlag(featureFlag: string, ev: Event): void {
    const enabled = (ev.target as HTMLInputElement).checked;
    this.featureFlagService.updateFeatureFlag(featureFlag, enabled);
  }
}
