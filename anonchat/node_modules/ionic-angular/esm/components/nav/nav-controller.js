function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @name NavController
 * @description
 *
 * NavController is the base class for navigation controller components like
 * [`Nav`](../Nav/) and [`Tab`](../../Tabs/Tab/). You use navigation controllers
 * to navigate to [pages](#creating_pages) in your app. At a basic level, a
 * navigation controller is an array of pages representing a particular history
 * (of a Tab for example). This array can be manipulated to navigate throughout
 * an app by pushing and popping pages or inserting and removing them at
 * arbitrary locations in history.
 *
 * The current page is the last one in the array, or the top of the stack if we
 * think of it that way.  [Pushing](#push) a new page onto the top of the
 * navigation stack causes the new page to be animated in, while [popping](#pop)
 * the current page will navigate to the previous page in the stack.
 *
 * Unless you are using a directive like [NavPush](../NavPush/), or need a
 * specific NavController, most times you will inject and use a reference to the
 * nearest NavController to manipulate the navigation stack.
 *
 * ## Basic usage
 * The simplest way to navigate through an app is to create and initialize a new
 * nav controller using the `<ion-nav>` component.  `ion-nav` extends the `NavController`
 * class.
 *
 * ```typescript
 * import { Component } from `@angular/core`;
 * import { ionicBootstrap } from 'ionic-angular';
 * import { StartPage } from './start-page';
 *
 * @Component(
 *   template: `<ion-nav [root]="rootPage"></ion-nav>`
 * })
 * class MyApp {
 *   // set the rootPage to the first page we want displayed
 *   private rootPage: any = StartPage;
 *
 *   constructor(){
 *   }
 * }
 *
 * ionicBootstrap(MyApp);
 * ```
 *
 * ### Injecting NavController
 * Injecting NavController will always get you an instance of the nearest
 * NavController, regardless of whether it is a Tab or a Nav.
 *
 * Behind the scenes, when Ionic instantiates a new NavController, it creates an
 * injector with NavController bound to that instance (usually either a Nav or
 * Tab) and adds the injector to its own providers.  For more information on
 * providers and dependency injection, see [Providers and DI]().
 *
 * Instead, you can inject NavController and know that it is the correct
 * navigation controller for most situations (for more advanced situations, see
 * [Menu](../../Menu/Menu/) and [Tab](../../Tab/Tab/)).
 *
 * ```ts
 *  import { NavController } from 'ionic-angular';
 *
 *  class MyComponent {
 *    constructor(public navCtrl: NavController) {
 *
 *    }
 *  }
 * ```
 *
 * ### Navigating from the Root component
 * What if you want to control navigation from your root app component?
 * You can't inject `NavController` because any components that are navigation
 * controllers are _children_ of the root component so they aren't available
 * to be injected.
 *
 * By adding a reference variable to the `ion-nav`, you can use `@ViewChild` to
 * get an instance of the `Nav` component, which is a navigation controller
 * (it extends `NavController`):
 *
 * ```typescript
 *
 * import { App, ViewChild } from '@angular/core';
 * import { NavController } from 'ionic-angular';
 *
 * @App({
 *    template: '<ion-nav #myNav [root]="rootPage"></ion-nav>'
 * })
 * export class MyApp {
 *    @ViewChild('myNav') nav : NavController
 *    private rootPage = TabsPage;
 *
 *    // Wait for the components in MyApp's template to be initialized
 *    // In this case, we are waiting for the Nav with id="my-nav"
 *    ngAfterViewInit() {
 *       // Let's navigate from TabsPage to Page1
 *       this.nav.push(Page1);
 *    }
 * }
 * ```
 *
 * ## View creation
 * Views are created when they are added to the navigation stack.  For methods
 * like [push()](#push), the NavController takes any component class that is
 * decorated with `@Component` as its first argument.  The NavController then
 * compiles that component, adds it to the app and animates it into view.
 *
 * By default, pages are cached and left in the DOM if they are navigated away
 * from but still in the navigation stack (the exiting page on a `push()` for
 * example).  They are destroyed when removed from the navigation stack (on
 * [pop()](#pop) or [setRoot()](#setRoot)).
 *
 * ## Pushing a View
 * To push a new view on to the navigation stack, use the `push` method.
 * If the page has an [`<ion-navbar>`](../api/components/nav-bar/NavBar/),
 * a back button will automatically be added to the pushed view.
 *
 * Data can also be passed to a view by passing an object to the `push` method.
 * The pushed view can then receive the data by accessing it via the `NavParams`
 * class.
 *
 * ```typescript
 * import { Component } from '@angular/core';
 * import { NavController } from 'ionic-angular';
 * import { OtherPage } from './other-page';
 * @Component({
 *    template: `
 *    <ion-header>
 *      <ion-navbar>
 *        <ion-title>Login</ion-title>
 *      </ion-navbar>
 *    </ion-header>
 *
 *    <ion-content>
 *      <button (click)="pushPage()">
 *        Go to OtherPage
 *      </button>
 *    </ion-content>
 *    `
 * })
 * export class StartPage {
 *   constructor(public navCtrl: NavController) {
 *   }
 *
 *   pushPage(){
 *     // push another page on to the navigation stack
 *     // causing the nav controller to transition to the new page
 *     // optional data can also be passed to the pushed page.
 *     this.navCtrl.push(OtherPage, {
 *       id: "123",
 *       name: "Carl"
 *     });
 *   }
 * }
 *
 * import { NavParams } from 'ionic-angular';
 *
 * @Component({
 *   template: `
 *   <ion-header>
 *     <ion-navbar>
 *       <ion-title>Other Page</ion-title>
 *     </ion-navbar>
 *   </ion-header>
 *   <ion-content>I'm the other page!</ion-content>`
 * })
 * class OtherPage {
 *   constructor(private navParams: NavParams) {
 *      let id = navParams.get('id');
 *      let name = navParams.get('name');
 *   }
 * }
 * ```
 *
 * ## Removing a view
 * To remove a view from the stack, use the `pop` method.
 * Popping a view will transition to the previous view.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { NavController } from 'ionic-angular';
 *
 * @Component({
 *   template: `
 *   <ion-header>
 *     <ion-navbar>
 *       <ion-title>Other Page</ion-title>
 *     </ion-navbar>
 *   </ion-header>
 *   <ion-content>I'm the other page!</ion-content>`
 * })
 * class OtherPage {
 *    constructor(private navController: NavController ){
 *    }
 *
 *    popView(){
 *      this.navController.pop();
 *    }
 * }
 * ```
 *
 * ## Lifecycle events
 * Lifecycle events are fired during various stages of navigation.  They can be
 * defined in any component type which is pushed/popped from a `NavController`.
 *
 * ```ts
 * import { Component } from '@angular/core';
 *
 * @Component({
 *   template: 'Hello World'
 * })
 * class HelloWorld {
 *   ionViewLoaded() {
 *     console.log("I'm alive!");
 *   }
 *   ionViewWillLeave() {
 *     console.log("Looks like I'm about to leave :(");
 *   }
 * }
 * ```
 *
 *  | Page Event          | Description                                                                                                                                                                                                                                                                        |
 *  |---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | `ionViewLoaded`     | Runs when the page has loaded. This event only happens once per page being created and added to the DOM. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The `ionViewLoaded` event is good place to put your setup code for the page. |
 *  | `ionViewWillEnter`  | Runs when the page is about to enter and become the active page.                                                                                                                                                                                                                   |
 *  | `ionViewDidEnter`   | Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.                                                                                                                                             |
 *  | `ionViewWillLeave`  | Runs when the page is about to leave and no longer be the active page.                                                                                                                                                                                                             |
 *  | `ionViewDidLeave`   | Runs when the page has finished leaving and is no longer the active page.                                                                                                                                                                                                          |
 *  | `ionViewWillUnload` | Runs when the page is about to be destroyed and have its elements removed.                                                                                                                                                                                                         |
 *  | `ionViewDidUnload`  | Runs after the page has been destroyed and its elements have been removed.
 *
 *
 * ## Asynchronous Nav Transitions
 *
 * Navigation transitions are asynchronous operations. When a transition is started,
 * the `push` or `pop` method will return immediately, before the transition is complete.
 *
 * Generally, the developer does not need to be concerned about this. In the event
 * multiple transitions need to be synchronized or transition timing is critical,
 * the best practice is to chain the transitions together using the return value
 * from the `push` and `pop` methods.
 *
 * The `push` and `pop` methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * Promises are a way to represent and chain together multiple asynchronous
 * operations in order. Navigation actions can be chained together very easily using promises.
 *
 * ```typescript
 * let navTransitionPromise = this.navController.push(Page2);
 * navTransitionPromise.then( () => {
 *   // the transition has completed, so I can push another page now
 *   return this.navController.push(Page3);
 * }).then( () => {
 *   // the second transition has completed, so I can push yet another page
    return this.navController.push(Page4);
 * }).then( () => {
 *   console.log('The transitions are complete!');
 * })
 * ```
 *
 * ## NavOptions
 *
 * Some methods on `NavController` allow for customizing the current transition.
 * To do this, we can pass an object with the modified properites.
 *
 *
 * | Property  | Value     | Description                                                                                                |
 * |-----------|-----------|------------------------------------------------------------------------------------------------------------|
 * | animate   | `boolean` | Whether or not the transition should animate.                                                              |
 * | animation | `string`  | What kind of animation should be used.                                                                     |
 * | direction | `string`  | The conceptual direction the user is navigating. For example, is the user navigating `forward`, or `back`? |
 * | duration  | `number`  | The length in milliseconds the animation should take.                                                      |
 * | easing    | `string`  | The easing for the animation.                                                                              |
 *
 * The property 'animation' understands the following values: `md-transition`, `ios-transition` and `wp-transition`.
 *
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
export var NavController = function NavController() {
  _classCallCheck(this, NavController);
};