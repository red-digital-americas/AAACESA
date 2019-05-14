export class BitacorasBusqueda {
    constructor() { }    
    public FechaInicial:string = "";    
    public FechaFinal:string = "";        
    public Modulo:string = "";    
    public IdCuentaEspecifica:string = "";    

    Clean() {
        this.FechaInicial = "";    
        this.FechaFinal = "";        
        this.Modulo = "";    
        this.IdCuentaEspecifica = "";    
    }
}

export class MercanciasBusqueda {
    constructor() { }    
    public Master:string = "";    
    public House:string = "";        

    Clean() {
        this.Master = "";    
        this.House = "";        
    }
}