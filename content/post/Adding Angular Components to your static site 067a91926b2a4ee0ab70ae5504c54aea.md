---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1633601646/main-codingcatdev-photo/czh38omkhxq4qe2v766h.png
devto: https://dev.to/codingcatdev/adding-angular-components-to-your-static-site-1g6k
excerpt: Utilizing Web Components within Hugo Static Site Generator (or any static site), to take Stripe/PayPal payments and more!
hashnode: https://hashnode.codingcat.dev/post-adding-angular-components-to-your-static-site
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=adding-angular-components-to-your-static-site&_id=067a91926b2a4ee0ab70ae5504c54aea
published: published
slug: adding-angular-components-to-your-static-site
start: September 12, 2019
title: Adding Angular Components to your static site
---
## Why Angular Components

Because the people want it!

![https://media.codingcat.dev/image/upload/v1657636818/main-codingcatdev-photo/a7b4ccfc-42c9-4499-bbdc-ac75591eedfa.png](https://media.codingcat.dev/image/upload/v1657636818/main-codingcatdev-photo/a7b4ccfc-42c9-4499-bbdc-ac75591eedfa.png)

### Demo

I plan to share a more in depth course on how to build all of this! For now I thought it would be cool just to see it all in action. Notice how after the site loads Firebase kicks in and checks to see if you are a pro member then dynamically hides items using a webcomponent that understands user state. The great part here is that I have many of the Angular items that access firebase already created and I don't have to reinvent the wheel!

[https://youtu.be/iyvVtOsMThI](https://youtu.be/iyvVtOsMThI)

Who do I have to thank for teaching all of this to me? [Jeff Delaney](https://fireship.io/contributors/jeff-delaney/) at [https://fireship.io/courses/stripe-payments/](https://fireship.io/courses/stripe-payments/)

## Allowing User

It is as easy as using `<ajonp-allow-if>` to wrap around any element and then use display none within that component.

### No more ads

An example of this is when a user registers and becomes a `Pro` member of AJonP, they will no longer see ads.For this I can just wrap my Hugo Go Partial:

```html
<ajonp-allow-if level="not-user">
    <ion-row>
        <ion-col text-center>
            <div class="ajonp-hide-lg-down">
                <!-- /21838128745/ajonp_new -->
                <div id="div-gpt-ad-xxxxxxxxxxxxxx-0" style="width: 970px; height: 90px; margin: auto;">
                    <script> googletag.cmd.push(function () { googletag.display('div-gpt-ad-xxxxxxxxxxxxxx-0'); }); </script>
                </div>
            </div>
        </ion-col>
    </ion-row>
</ajonp-allow-if>

```

## Angular Parts

The template is pretty straight forward, Angular either shows the component or removes it based on the `*ngIf`.

```html
<div *ngIf="allowed">
    <slot></slot>
</div>
<div *ngIf="!allowed">
    <slot name="falsey"></slot>
</div>

```

### Angular Component

Some things to note are the [code>@Input</code](mailto:code%3E@Input%3C/code) decorations. This allows for you to pass in all of these different items as attributes on the `ajonp-allow-if` component. In our example above I pass in `level="not-user"` to the `@Input level` decorator.What is wonderful about using Angular is that you get all the nice dependency injection that you would normally get with a standard Angular component!

```tsx
import { Component, ViewEncapsulation, ChangeDetectorRef, Input, AfterViewInit, ElementRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({ templateUrl: './allow-if.component.html', encapsulation: ViewEncapsulation.ShadowDom })

export class AllowIfComponent implements AfterViewInit {
    @Input() selector;
    @Input() level: 'pro' | 'user' | 'not-pro' | 'not-user' | 'not-user-not-pro';
    @Input() reverse = false;
    @Input() product; constructor( private cd: ChangeDetectorRef, public auth: AuthService, private el: ElementRef, ) {

    }
    ngAfterViewInit() {
        this.el.nativeElement.style.visibility = 'visible';
    }
    allowed() {
        const u = this.auth.userDoc;
        const products = u && u.products && Object.keys(u.products);

        // Handle Product
        if (products && products.includes(this.product)) {
            return true;
        }
        // Handle Level
        switch (this.level) {
            case 'user':
                return u;
            case 'pro':
                return u && u.is_pro;
            case 'not-pro':
                return u && !u.is_pro;
            case 'not-user':
                return !u;
            case 'not-user-not-pro': return !u || !u.is_pro;
            default: return false;
        }
    }
}

```

Here you can see I am utilizing the full firebase library for authentication, which is sweet!

```tsx
import { Injectable, ApplicationRef } from '@angular/core';
import * as firebase from 'firebase/app';
import { user } from 'rxfire/auth';
import { docData } from 'rxfire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, take, tap, isEmpty } from 'rxjs/operators';

import { AjonpUser } from '../models/ajonp-user';
import { AngularfirebaseService } from './angularfirebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authClient = firebase.auth();

  user$: Observable<any>;
  userDoc$: Observable<any>;

  user;
  userDoc;

  constructor(private app: ApplicationRef, private db: AngularfirebaseService) {
    // Why service subsciptions? Maintain state between route changes with change detection.
    this.user$ = user(this.authClient)
      .pipe(tap(u => {
        this.user = u;
        this.app.tick();
      }));

    this.userDoc$ = this.getUserDoc$('users').pipe(tap(u => {
      this.userDoc = u;
      this.app.tick();
    }));

    this.userDoc$.pipe(take(1)).subscribe((u: AjonpUser) => {
      if (u && Object.keys(u).length) {
        const ajonpUser: AjonpUser = { uid: u.uid };
        this.updateUserData(ajonpUser).catch(error => {
          console.log(error);
        });
      } else {
        if (this.user && Object.keys(this.user).length) {
          const data: AjonpUser = {
            uid: this.user.uid,
            email: this.user.email,
            emailVerified: this.user.emailVerified,
            displayName: this.user.displayName || this.user.email || this.user.phoneNumber,
            phoneNumber: this.user.phoneNumber,
            photoURL: this.user.photoURL,
            roles: {
              subscriber: true
            }
          };
          this.setUserData(data).catch(error => {
            console.log(error);
          });
        }
      }
    });

    this.user$.subscribe();
    this.userDoc$.subscribe();
  }

  getUserDoc$(col) {
    return user(this.authClient).pipe(
      switchMap(u => {
        return u ? docData(firebase.firestore().doc(${col}/${(u as any).uid})) : of(null);
      })
    );
  }

  ///// Role-based Authorization //////

  canCreate(u: AjonpUser): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(u, allowed);
  }

  canDelete(u: AjonpUser): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(u, allowed);
  }

  canEdit(u: AjonpUser): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(u, allowed);
  }

  canRead(u: AjonpUser): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(u, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(u: AjonpUser, allowedRoles: string[]): boolean {
    if (!u) {
      return false;
    }
    for (const role of allowedRoles) {
      if (u.roles[role]) {
        return true;
      }
    }
    return false;
  }

  public setUserData(u: AjonpUser) {
    return this.db.set(users/${u.uid}, u);
  }

  // Sets user data to firestore after succesful signin
  private updateUserData(u: AjonpUser) {
    return this.db.update(users/${u.uid}, u);
  }
  signOut() {
    this.authClient.signOut();
    location.href = '/pro';
  }
}

```