import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyBodyComponent } from './lobby-body.component';

describe('LobbyBodyComponent', () => {
  let component: LobbyBodyComponent;
  let fixture: ComponentFixture<LobbyBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
