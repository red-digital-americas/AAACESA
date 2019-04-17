import { AbandonoModule } from './abandono.module';

describe('AbandonoModule', () => {
  let abandonoModule: AbandonoModule;

  beforeEach(() => {
    abandonoModule = new AbandonoModule();
  });

  it('should create an instance', () => {
    expect(abandonoModule).toBeTruthy();
  });
});
