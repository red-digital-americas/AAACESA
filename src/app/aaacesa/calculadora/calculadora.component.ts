import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { ApiServices } from '../../services/api.services';
import { CalculoManiobra, ResCalculoManiobra } from '../../models/bitacoras.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { MatSnackBar } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-calculdora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FormBuilder,ApiServices]
})

export class CalculadoraComponent implements OnInit {

  loading=false;
  calculoManiobra: CalculoManiobra = new CalculoManiobra();
  resCalcuo: ResCalculoManiobra = new ResCalculoManiobra();
  getTipoIngreso:string = "";
  getCadena: string = "";
  calculoForm: FormGroup;
  minDate = this.minDate = moment(new Date()).add(1, 'days').toDate();
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(private apiservice : ApiServices,private _formBuilder: FormBuilder,private localeService: BsLocaleService,public snackBar: MatSnackBar) {
    this.localeService.use('es');
   }

  ngOnInit() {
    this.calculoForm = this._formBuilder.group({
      tMaster: ['', [Validators.required, Validators.pattern('([0-9]{3}-[0-9]{8})')]],
      tHouse: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]],
      sTipoEntrada:['',Validators.required],
      sConceptoCadenaFria:['',Validators.required],
      sPeso:['',[Validators.required, Validators.pattern('^[0-9]*[.]?[0-9]*')]],
      sValorAduana:['',[Validators.required, Validators.pattern('^[0-9]*[.]?[0-9]*')]],
      fechaEntradaCtrl: [moment(new Date()).add(1, 'days').toDate(), Validators.required],
      fechaSalidaCtrl: [moment(new Date()).add(1, 'days').toDate(), Validators.required],
    })
    this.apiservice.service_general_get('/Catalogos/GetCatalogoTipoIngresoMercancia').subscribe((resIM)=>{
      this.getTipoIngreso = resIM;
    });
    this.apiservice.service_general_get('/Catalogos/GetConceptosCadenaFria').subscribe((resCF)=>{
      this.getCadena = resCF;
    });
    
  }

  calcularManiobra(){
    this.loading=true;
    let Fe = moment(this.calculoManiobra.FechaEntrada).format('DD/MM/YYYY');
    let Fs = moment(this.calculoManiobra.FechaSalida).format('DD/MM/YYYY');    
    this.calculoManiobra.FechaEntrada = Fe;
    this.calculoManiobra.FechaSalida = Fs;
    this.apiservice.service_general_get_with_params('/CalculoManiobras',this.calculoManiobra).subscribe((resIM)=>{
      this.loading=false;
      this.resCalcuo=resIM;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });
  }

  clean(){
    this.resCalcuo.CostoAlmacenaje="";
    this.resCalcuo.CostoCongelacion="";
    this.resCalcuo.CostoCustodia="";
    this.resCalcuo.CostoManiobra="";
    this.resCalcuo.CostoPrevio="";
    this.resCalcuo.CostoRefrigeracion="";
    this.resCalcuo.CostoTEC="";
    this.resCalcuo.IVA="";
    this.resCalcuo.Subtotal="";
    this.resCalcuo.Total="";
    this.calculoManiobra.ConceptoCadenaFria="";
    this.calculoManiobra.FechaEntrada="";
    this.calculoManiobra.FechaSalida="";
    this.calculoManiobra.Peso="";
    this.calculoManiobra.TipoEntrada="";
    this.calculoManiobra.ValorAduana="";
  }
  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}
