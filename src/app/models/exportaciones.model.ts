export class ExportacionBusqueda {
    constructor() { }    
    public IdExportacion:string = "";	
    public FechaInicial:string = "";    
    public FechaFinal:string = "";        
    public Master:string = "";    
    public House:string = "";  
    public Pedimento:string = "";
    public Estatus:string = "";       


    Clean() {
        this.IdExportacion = "";	
        this.FechaInicial = "";    
        this.FechaFinal = "";        
        this.Master = "";    
        this.House = "";  
        this.Pedimento = "";
        this.Estatus = "";                   
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

export class ExportacionNuevo {
    constructor() { }
    public Master:string;    
    public House:string;                 
    public Pedimento:string;
    public Piezas:string;
    public Peso:string;
    public FechaEntradaMercancia:string;    	  	    
    public Seguimiento:Seguimiento [] = [new Seguimiento()]; 
    public Documentos:Documento [] = [];
}

//////////////
// Update Seguimiento
export class ExportacionSeguimiento {
    constructor() { }    
    IdExportacion:string;
    Estatus:string;
    Comentarios:string = "";
    Documentos:Documento[] = [];

    cleanSeguimiento() {
        this.Comentarios = "";
        this.Documentos = [];
    }
}
