import { PrealertasModule } from './prealertas.module';

describe('PrealertasModule', () => {
  let prealertasModule: PrealertasModule;

  beforeEach(() => {
    prealertasModule = new PrealertasModule();
  });

  it('should create an instance', () => {
    expect(prealertasModule).toBeTruthy();
  });
});
