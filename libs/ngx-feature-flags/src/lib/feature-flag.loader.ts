import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export abstract class FeatureFlagLoader<TFeatureFlag extends string = string> {
  public abstract getFeatureFlags(): Observable<Record<TFeatureFlag, boolean>>;
}

/**
 * This loader is just a placeholder that does nothing, in case you don't need a loader at all.
 */
@Injectable()
export class FeatureFlagFakeLoader extends FeatureFlagLoader {
  public getFeatureFlags(): Observable<Record<string, boolean>> {
    return of({});
  }
}
