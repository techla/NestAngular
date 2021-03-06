import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { getUser } from 'src/app/authentication';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { difference } from 'lodash';
import { fromRouter } from 'src/app/common/router-state';

@Injectable()
export class CoreGuardService implements CanActivate {
  constructor(private store: Store<any>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
    .select(getUser)
    .pipe(map(user => this.hasExpectedRoles(user, route)), take(1));
  }

  hasExpectedRoles(user, route): boolean {
    const expectedRoles = route.data.expectedRoles;
    if (difference(user.roles, expectedRoles).length === expectedRoles.length) {
      this.store.dispatch(new fromRouter.Go({ path: ['auth'] }));

      return false;
    }

    return true;
  }
}
