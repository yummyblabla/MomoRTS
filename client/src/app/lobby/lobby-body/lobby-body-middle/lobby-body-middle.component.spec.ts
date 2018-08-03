import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyBodyMiddleComponent } from './lobby-body-middle.component';

describe('LobbyBodyMiddleComponent', () => {
  let component: LobbyBodyMiddleComponent;
  let fixture: ComponentFixture<LobbyBodyMiddleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyBodyMiddleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyBodyMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
