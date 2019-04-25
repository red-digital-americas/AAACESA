import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class CatalogosService {
  
  constructor(private http:HttpClient) { 
    console.log("catalogo service listo");
  }
  
  GetQuery (query:string) {
    const url = `assets/Catalogos/${query}`;  
    return this.http.get(url);
  }
  
  GetInstruccionesManejo () {
    return this.GetQuery("instruccionesManejo.json");    
  } 

  GetAlmacenOrigen () {
    return this.GetQuery("almacenOrigen.json");    
  }

  GetRangoTemperatura () {
    return this.GetQuery("rangoTemperatura.json");    
  }

  GetMetodoPago () {
    return this.GetQuery("metodoPago.json");    
  }

  GetUsoCFDI () {
    return this.GetQuery("usoCFDI.json");    
  }

  GetCondicionesAlmacenes () {
    return this.GetQuery("condicionesAlmacenes.json");    
  } 
}
