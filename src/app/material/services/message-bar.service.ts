import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Helper service for displaying material snack-bar messages
 * to the user.
 */
@Injectable({
  providedIn: 'root'
})
export class MessageBarService {

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Shows a snack-bar message to the user.
   *
   * @param message message to be shown.
   */
  showMessage(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
