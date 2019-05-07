import { FinanzasModule } from './finanzas.module';

describe('FinanzasModule', () => {
  let finanzasModule: FinanzasModule;

  beforeEach(() => {
    finanzasModule = new FinanzasModule();
  });

  it('should create an instance', () => {
    expect(finanzasModule).toBeTruthy();
  });
});
