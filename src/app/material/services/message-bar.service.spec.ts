import { TestBed } from '@angular/core/testing';

import { MessageBarService } from './message-bar.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

describe('MessageBarService', () => {
  let service: MessageBarService;
  let fakeSnackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ],
    });
    fakeSnackBar = TestBed.inject(MatSnackBar);
    service = new MessageBarService(fakeSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('showMessage function should display the correct message', () => {
    // Arrange
    const messageToShow = 'this is a message';
    let message: string;
    let actionString: string;
    let duration: number;
    spyOn(fakeSnackBar, 'open').and.callFake((a, b, c) => {
      message = a;
      actionString = b;
      duration = c.duration;
      return null;
    });

    // Act
    service.showMessage(messageToShow);

    // Assert
    expect(fakeSnackBar.open).toHaveBeenCalled();
    expect(messageToShow).toEqual(message);
    expect(actionString).toEqual('OK');
    expect(duration).toEqual(3000);
  });
});
