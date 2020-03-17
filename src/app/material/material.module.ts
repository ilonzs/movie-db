import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageBarService } from './services/message-bar.service';
import { MatDividerModule } from '@angular/material/divider';

// Material modules used throughout this application
const materialElements = [
  MatButtonModule,
  MatToolbarModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDividerModule
];

/**
 * Container module for other angular material modules used
 * in this application, along with other custom helper services.
 *
 * @tip You only need to import this module once whenever you have to
 * use Angular material modules.
 */
@NgModule({
  declarations: [],
  imports: [
    materialElements
  ],
  exports: [
    materialElements
  ],
  providers: [MessageBarService]
})
export class MaterialModule { }

export * from './services/message-bar.service';
