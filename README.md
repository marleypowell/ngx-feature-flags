# ngx-feature-flags

> The feature flag library for Angular

## Installation

First you need to install the npm module:

```
npm install ngx-feature-flags --save
```

## Usage

#### 1. Import the `FeatureFlagModule`:

You have to import `FeatureFlagModule.forRoot()` in the root NgModule of your application.

The [`forRoot`](https://angular.io/api/router/RouterModule#forroot) static method is a convention that provides and configures services at the same time.
Make sure you only call this method in the root module of your application, most of the time called `AppModule`.
This method allows you to configure the `FeatureFlagModule` by specifying a loader.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FeatureFlagModule } from '@ngx-translate/core';

@NgModule({
  imports: [BrowserModule, FeatureFlagModule.forRoot()],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

##### SharedModule

If you use a [`SharedModule`](https://angular.io/guide/sharing-ngmodules) that you import in multiple other feature modules,
you can export the `FeatureFlagModule` to make sure you don't have to import it in every module.

```ts
@NgModule({
  exports: [CommonModule, FeatureFlagModule],
})
export class SharedModule {}
```

> Note: Never call a `forRoot` static method in the `SharedModule`. You might end up with different instances of the service in your injector tree. But you can use `forChild` if necessary.

##### Lazy loaded modules

When you lazy load a module, you should use the `forChild` static method to import the `FeatureFlagModule`.

Since lazy loaded modules use a different injector from the rest of your application, you can configure them separately with a different loader.

```ts
@NgModule({
  imports: [
    FeatureFlagModule.forChild({
      loader: { provide: FeatureFlagLoader, useClass: CustomLoader },
    }),
  ],
})
export class LazyLoadedModule {}
```

##### AoT

If you want to configure a custom `FeatureFlagLoader` while using [AoT compilation](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html) or [Ionic](http://ionic.io/), you must use an exported function instead of an inline function.

```ts
export function createFeatureFlagLoader(http: HttpClient) {
  return new FeatureFlagHttpLoader(http, './assets/feature-flags.json');
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FeatureFlagModule.forRoot({
      loader: {
        provide: FeatureFlagLoader,
        useFactory: createFeatureFlagLoader,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### 2. Use the service, or the directive:

You can either use the `FeatureFlagService`, or the `FeatureFlagDirective` to get your feature flag values.

With the **service**, it looks like this:

```ts
featureFlag.isEnabled$('FeatureA').subscribe((res: string) => {
  console.log(res);
  //=> 'true'
});
```

This is how you use the **directive**:

```html
<div *featureFlag="'FeatureA'"></div>
```
