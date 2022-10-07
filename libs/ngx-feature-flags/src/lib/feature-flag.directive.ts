import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { mergeMap, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { FeatureFlagService } from './feature-flag.service';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[featureFlag]' })
export class FeatureFlagDirective implements OnInit, OnDestroy {
  private readonly featureName$ = new ReplaySubject<string>(1);

  @Input()
  public set featureFlag(featureName: string | null) {
    if (featureName) {
      this.featureName$.next(featureName);
    }
  }

  private isHidden = true;

  private readonly unsubscribe$ = new Subject<void>();

  public constructor(
    private featureFlagService: FeatureFlagService,
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {}

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public ngOnInit(): void {
    this.featureName$
      .pipe(
        mergeMap((featureName) =>
          this.featureFlagService.isEnabled$(featureName)
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((featureEnabled) => {
        this.updateView(featureEnabled);
      });
  }

  private updateView(featureEnabled: boolean): void {
    if (featureEnabled) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
}
