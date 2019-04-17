import { AbandonoRoutingModule } from './abandono-routing.module';

describe('AbandonoRoutingModule', () => {
  let abandonoRoutingModule: AbandonoRoutingModule;

  beforeEach(() => {
    abandonoRoutingModule = new AbandonoRoutingModule();
  });

  it('should create an instance', () => {
    expect(abandonoRoutingModule).toBeTruthy();
  });
});
