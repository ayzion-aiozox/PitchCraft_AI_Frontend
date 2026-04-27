import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageDialogComponent } from './language-dialog.component';

describe('LanguageDialogComponent', () => {
  let component: LanguageDialogComponent;
  let fixture: ComponentFixture<LanguageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot(), LanguageDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: { close: () => {} } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
