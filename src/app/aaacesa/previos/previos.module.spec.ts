import { PreviosModule } from './previos.module';

describe('PreviosModule', () => {
  let previosModule: PreviosModule;

  beforeEach(() => {
    previosModule = new PreviosModule();
  });

  it('should create an instance', () => {
    expect(previosModule).toBeTruthy();
  });
});
