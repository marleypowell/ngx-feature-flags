import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { FeatureFlagLoader } from './feature-flag.loader';

@Injectable()
export class FeatureFlagService {
  private readonly featureFlags = new BehaviorSubject<Record<string, boolean>>(
    {}
  );

  public readonly featureFlags$ = this.featureFlags.asObservable();

  public readonly unsubscribe$ = new Subject();

  public constructor(private loader: FeatureFlagLoader) {
    this.getFeatureFlags();
  }

  public getFeatureFlags(): Observable<Record<string, boolean>> {
    const loadingFeatureFlags = this.loader.getFeatureFlags().pipe(take(1));

    loadingFeatureFlags
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((featureFlags) => {
        this.featureFlags.next(featureFlags);
      });

    return loadingFeatureFlags;
  }

  public isEnabled$(featureFlag: string): Observable<boolean> {
    return this.featureFlags.pipe(
      map((featureFlags) => featureFlags[featureFlag])
    );
  }

  public isDisabled$(featureFlag: string): Observable<boolean> {
    return this.featureFlags.pipe(
      map((featureFlags) => !featureFlags[featureFlag])
    );
  }

  public isEnabled(featureFlag: string): boolean {
    return this.featureFlags.getValue()[featureFlag];
  }

  public isDisabled(featureFlag: string): boolean {
    return !this.featureFlags.getValue()[featureFlag];
  }

  public updateFeatureFlag(featureFlag: string, enabled: boolean): void {
    this.featureFlags.next({
      ...this.featureFlags.getValue(),
      [featureFlag]: enabled,
    });
  }
}
