"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var aaacesa_salidas_component_1 = require("./aaacesa-salidas.component");
describe('AaacesaSalidasComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [aaacesa_salidas_component_1.AaacesaSalidasComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(aaacesa_salidas_component_1.AaacesaSalidasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=aaacesa-salidas.component.spec.js.map