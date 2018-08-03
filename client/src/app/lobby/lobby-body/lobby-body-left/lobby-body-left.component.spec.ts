import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyBodyLeftComponent } from './lobby-body-left.component';

describe('LobbyBodyLeftComponent', () => {
  let component: LobbyBodyLeftComponent;
  let fixture: ComponentFixture<LobbyBodyLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyBodyLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyBodyLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
