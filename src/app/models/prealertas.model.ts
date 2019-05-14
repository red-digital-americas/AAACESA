export class PrealertaBusqueda {
    constructor() { }    
    public IdPrealerta:string = "";	
    public FechaInicial:string = "";    
    public FechaFinal:string = "";        
    public Master:string = "";    
    public House:string = "";    
    public FechaArribo:string = "";    
    public Consignatario:string = "";    
    public Referencia:string = "";    
    public ClaveInstruccionManejo = "";

    Clean() {
        this.IdPrealerta = "";	    
        this.FechaInicial = "";    
        this.FechaFinal = "";        
        this.Master = "";    
        this.House = "";    
        this.FechaArribo = "";    
        this.Consignatario = "";    
        this.Referencia = "";    
        this.ClaveInstruccionManejo = "";
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

export class PrealertaNuevo {
    constructor() { }
    public GuiaMaster:string;    
    public GuiaHouse:string;    
    public AlmacenOrigen:string;
    public FechaArribo:string;    
    public CondicionAlmacenaje:string;
    public Consignatario:string;
    public InstruccionesManejo:string;       
    public Piezas:number;    
    public Peso:number;    
    public RangoTemperatura:string;
    public Referencia:string;
    public Consolidado:boolean = false;
    public MetodoPago:string;
    public UsoCFDI:string;            
    public Seguimiento:Seguimiento [] = [new Seguimiento()]; 
    public Documentos:Documento [] = [];
}

//////////////
// Update Seguimiento
export class PrealertaSeguimiento {
    constructor() { }    
    IdPrealertas:string;
    Estatus:string;
    Comentarios:string = "";
    Documentos:Documento[] = [];

    cleanSeguimiento() {
        this.Comentarios = "";
        this.Documentos = [];
    }
}



//////////////
// Estatus Transferencia
export class EstatusTransferencia {
    Estado:string;
    Fecha:string;
    constructor (estado:string, fecha:string) {
        this.Estado = estado;
        this.Fecha = fecha;
    }
}