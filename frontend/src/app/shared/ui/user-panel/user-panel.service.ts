import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserPanelService {
  private _open = signal(false);

  readonly open = this._open.asReadonly();

  toggle() {
    this._open.update((v) => !v);
  }

  close() {
    this._open.set(false);
  }
}
