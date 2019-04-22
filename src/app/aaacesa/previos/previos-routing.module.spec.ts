import { PreviosRoutingModule } from './previos-routing.module';

describe('PreviosRoutingModule', () => {
  let previosRoutingModule: PreviosRoutingModule;

  beforeEach(() => {
    previosRoutingModule = new PreviosRoutingModule();
  });

  it('should create an instance', () => {
    expect(previosRoutingModule).toBeTruthy();
  });
});
