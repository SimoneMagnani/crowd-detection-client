import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCameraComponent } from './show-camera.component';

describe('ShowCameraComponent', () => {
  let component: ShowCameraComponent;
  let fixture: ComponentFixture<ShowCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
