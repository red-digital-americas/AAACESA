import { CalculadoraRoutingModule } from './calculadora-routing.module';

describe('CalculadoraRoutingModule', () => {
  let calculadoraRoutingModule: CalculadoraRoutingModule;

  beforeEach(() => {
    calculadoraRoutingModule = new CalculadoraRoutingModule();
  });

  it('should create an instance', () => {
    expect(calculadoraRoutingModule).toBeTruthy();
  });
});
