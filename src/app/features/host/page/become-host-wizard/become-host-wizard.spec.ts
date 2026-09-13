import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BecomeHostWizard } from './become-host-wizard.page.';
import { SpacesService } from '../../../../core/services/spaces.service';
import { HostService } from '../../../../core/services/host.service';

describe('BecomeHostWizard', () => {
  let fixture: ComponentFixture<BecomeHostWizard>;
  let component: BecomeHostWizard;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let spacesServiceMock: { create: ReturnType<typeof vi.fn> };
  let hostServiceMock: { applyForHost: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerMock = { navigate: vi.fn() };
    spacesServiceMock = { create: vi.fn().mockResolvedValue(undefined) };
    hostServiceMock = { applyForHost: vi.fn().mockResolvedValue('host1') };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SpacesService, useValue: spacesServiceMock },
        { provide: HostService, useValue: hostServiceMock },
      ],
    });

    fixture = TestBed.createComponent(BecomeHostWizard);
    component = fixture.componentInstance;
  });

  it('does not advance when the personal form is invalid', () => {
    component.nextStep();
    expect(component.currentStep).toBe(0);
  });

  it('advances to step 1 when the personal form is valid', () => {
    component.personalForm.setValue({ firstName: 'Ana', lastName: 'López', phone: '123456789' });
    component.nextStep();
    expect(component.currentStep).toBe(1);
  });

  it('does not advance to step 2 when the fiscal form is invalid', () => {
    component.currentStep = 1;
    component.nextStep();
    expect(component.currentStep).toBe(1);
  });

  it('advances to step 2 when the fiscal form is valid', () => {
    component.currentStep = 1;
    component.fiscalForm.setValue({
      entityType: 'particular',
      fiscalName: 'Ana López',
      documentType: 'NIF',
      documentNumber: '12345678A',
      huttbLicenseNumber: 'HUTB-001',
      cadastralReference: 'CAD-001',
      habitabilityCertificate: 'CERT-001',
      address: 'Calle 1',
      city: 'Barcelona',
      zipCode: 8002,
      tourismLicenseNumber: '',
      bankAccount: 'ES1234',
    });
    component.nextStep();
    expect(component.currentStep).toBe(2);
  });

  it('goes back a step', () => {
    component.currentStep = 2;
    component.previousStep();
    expect(component.currentStep).toBe(1);
  });

  it('does not go below step 0', () => {
    component.currentStep = 0;
    component.previousStep();
    expect(component.currentStep).toBe(0);
  });

  it('applies for host and creates the space on submit', async () => {
    const spaceData = { name: 'Terraza' } as any;

    await component.onSpaceSubmit(spaceData);

    expect(hostServiceMock.applyForHost).toHaveBeenCalledTimes(1);
    expect(spacesServiceMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Terraza', hostId: 'host1' }),
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/marketplace']);
  });
});