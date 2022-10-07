import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { FeatureFlagDirective } from './feature-flag.directive';
import {
  FeatureFlagFakeLoader,
  FeatureFlagLoader,
} from './feature-flag.loader';
import { FeatureFlagService } from './feature-flag.service';

export interface FeatureFlagModuleConfig {
  loader?: Provider;
}

@NgModule({
  declarations: [FeatureFlagDirective],
  exports: [FeatureFlagDirective],
})
export class FeatureFlagModule {
  /**
   * Use this method in your root module to provide the FeatureFlagService.
   */
  public static forRoot(
    config: FeatureFlagModuleConfig = {}
  ): ModuleWithProviders<FeatureFlagModule> {
    return {
      ngModule: FeatureFlagModule,
      providers: [
        config.loader ?? {
          provide: FeatureFlagLoader,
          useClass: FeatureFlagFakeLoader,
        },
        FeatureFlagService,
      ],
    };
  }

  /**
   * Use this method in your other (non root) modules to import the directive/pipe.
   */
  public static forChild(
    config: FeatureFlagModuleConfig = {}
  ): ModuleWithProviders<FeatureFlagModule> {
    return {
      ngModule: FeatureFlagModule,
      providers: [
        config.loader || {
          provide: FeatureFlagLoader,
          useClass: FeatureFlagFakeLoader,
        },
        FeatureFlagService,
      ],
    };
  }
}
