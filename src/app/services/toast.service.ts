import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _actionMessage: string = 'Close';

  constructor(private _snackBar: MatSnackBar) { }

  public open(message: string, isSuccess: boolean) {
    let snackBarClass: string = isSuccess ? 'success-snack-bar' : 'failure-snack-bar';
    this._snackBar.open(message, this._actionMessage, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snack-bar', snackBarClass]
    })
  }
}
