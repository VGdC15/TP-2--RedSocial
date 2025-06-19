import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaCargandoComponent } from './pantalla-cargando.component';

describe('PantallaCargandoComponent', () => {
  let component: PantallaCargandoComponent;
  let fixture: ComponentFixture<PantallaCargandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaCargandoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaCargandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
