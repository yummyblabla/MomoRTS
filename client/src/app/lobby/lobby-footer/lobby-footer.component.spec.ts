import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyFooterComponent } from './lobby-footer.component';

describe('LobbyFooterComponent', () => {
  let component: LobbyFooterComponent;
  let fixture: ComponentFixture<LobbyFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
