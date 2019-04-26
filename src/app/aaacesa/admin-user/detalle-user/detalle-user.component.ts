import { Component, OnInit, ViewChild, Input, forwardRef, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ApiServices } from '../../../services/api.services';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DetalleUserComponent),
  multi: true
};
@Component({
  selector: 'app-detalle-user',
  templateUrl: './detalle-user.component.html',
  styleUrls: ['./detalle-user.component.scss'],
  providers: [ApiServices ,INLINE_EDIT_CONTROL_VALUE_ACCESSOR]
})
export class DetalleUserComponent implements ControlValueAccessor, OnInit {
  @ViewChild('inlineEditControl') inlineEditControl; // input DOM element
  @Input() nomUser: string = '';  // Label value for input element
  @Input() perfilUser: string = '';  // Label value for input element
  @Input() type: string = 'text'; // The type of input element
  @Input() required: boolean = false; // Is input requried?
  @Input() disabled: boolean = false; // Is input disabled?
  title: string;
  cveCliente: string;
  mailUser;
  telUser;
  
  modalRef2: BsModalRef;

  private _value: string = ''; // Private variable for input value
  preValue: string = ''; // The value before clicking to edit
  editing: boolean = false; // Is Component in edit mode?
  onChange: any = Function.prototype; // Trascend the onChange event
  onTouched: any = Function.prototype; // Trascend the onTouch event

  constructor(public modalRef: BsModalRef, private modalService: BsModalService, private apiservices: ApiServices) { }

  ngOnInit() {
     this.apiservices.service_general_get("/AdministracionCuentas/GetAccountById/"+this.cveCliente).subscribe((res)=>{
      console.log(res);
      this.nomUser = res.Nombre+" "+res.Paterno+" "+res.Materno;
      this.perfilUser = res.Perfil['ClavePerfil'];
      this.mailUser = res.Correo;
      this.telUser = res.Telefono;
    });
  }

  actualiza(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
    this.modalRef.hide();
    this.modalRef = null;
  }


  // Control Value Accessors for ngModel
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  // Required for ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onBlur($event: Event) {
    this.editing = false;
  }

  // Start the editting process for the input element
  edit(value) {
    if (this.disabled) {
      return;
    }
    this.preValue = value;
    this.editing = true;
  }

}
