import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyBodyRightComponent } from './lobby-body-right.component';

describe('LobbyBodyRightComponent', () => {
  let component: LobbyBodyRightComponent;
  let fixture: ComponentFixture<LobbyBodyRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyBodyRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyBodyRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
