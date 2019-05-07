export class SalidaBusqueda {
    constructor() { }    
    public IdAdelantoSalidas:string = "";	
    public FechaInicial:string = "";    
    public FechaFinal:string = "";        
    public Master:string = "";    
    public House:string = "";       
    public Estatus:string = "";
    public Referencia:string = "";    


    Clean() {
        this.IdAdelantoSalidas = "";	
        this.FechaInicial = "";    
        this.FechaFinal = "";        
        this.Master = "";    
        this.House = "";    
        this.Estatus = "";
        this.Referencia = "";            
    }
}

////////////////
// Crear Prealerta
export class Seguimiento {
    public Comentarios:string;
}

export class Documento {
    public NombreDocumento:string;
    public Archivo:string;
}

export class SalidaNuevo {
    constructor() { }
    public Master:string;    
    public House:string;    
    public RFCFacturar:string;         
    public Pedimento:string;
    public Subdivision:boolean = false;
    public FechaSalida:string;   
    public Patente:string;
    public Seguimiento:Seguimiento [] = [new Seguimiento()]; 
    public Documentos:Documento [] = [];
}

//////////////
// Update Seguimiento
export class SalidaSeguimiento {
    constructor() { }    
    IdAdelantoSalidas:string;
    Estatus:string;
    Comentarios:string = "";
    Documentos:Documento[] = [];

    cleanSeguimiento() {
        this.Comentarios = "";
        this.Documentos = [];
    }
}
