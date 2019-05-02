export class PrevioBusqueda {
    constructor() { }    
    public IdAdelantoPrevio:string = "";	
    public FechaInicial:string = "";    
    public FechaFinal:string = "";    
    public Patente:string = "";    
    public Master:string = "";    
    public House:string = "";    
    public FechaPrevio:string = "";    
    public Estatus:string = "";    
    public Referencia:string = "";    
}

////////////////
// Crear Previo
export class Seguimiento {
    public Comentarios:string;
}

export class Documento {
    public NombreDocumento:string;
    public Archivo:string;
}

export class PrevioNuevo {
    constructor() { }
    public Master:string;    
    public House:string;    
    public Nombre:string;    
    public Paterno:string;    
    public Materno:string;  
    public NumGafete:string;    
    public Patente:string;    
    public FechaPrevio:string;    
    public Etiquetado:boolean = false;
    public Piezas:number;    
    public Peso:number;    
    public Seguimiento:Seguimiento [] = []; 
    public Documentos:Documento [] = [];
}

//////////////
// Update Seguimiento
export class PrevioSeguimiento {
    constructor() { }    
    IdAdelantoPrevios:string;
    Estatus:string;
    Comentarios:string;
    Documentos:Documento[];
}
