export class MercanciasBusqueda {
    constructor() { }    
    public Master:string = "";    
    public House:string = "";        

    Clean() {
        this.Master = "";    
        this.House = "";        
    }
}

export class GetInformacionGeneral {
    constructor() { }    
    public Master:string = "";    
    public House:string = "";        
    public Parcialidad:string = "";        
    public Peso:string = "";        
    public Piezas:string = "";        
    public FechaArribo:string = "";        
    public DescMercancia:string = "";        

    Clean() {
        this.Master = "";    
        this.House = "";  
        this.Parcialidad = "";  
        this.Peso = "";  
        this.Piezas = "";  
        this.FechaArribo = "";  
        this.DescMercancia = "";  
    }
}

export class GetEstatus {
    constructor() { }    
    public Master:string = "";    
    public House:string = "";        
    public UltimaZona:string = "";        
    public NumPrevios:string = "";        
    public FechaUltimoPrevio:string = "";        
    public PesoUltimoPrevio:string = "";        
    public PzasUltimoPrevio:string = "";        
    public FechaAbandono:string = "";        

    Clean() {
        this.Master = "";    
        this.House = "";  
        this.UltimaZona = "";  
        this.NumPrevios = "";  
        this.FechaUltimoPrevio = "";  
        this.PesoUltimoPrevio = "";  
        this.PzasUltimoPrevio = "";  
        this.FechaAbandono = "";  
    }
}

export class GetInformacionSalidas {
    constructor() { }    
    public FechaSalida:string = "";    
    public Folio:string = "";        
    public Pedimento:string = "";        
    public RFC:string = "";        
    public Importe:string = "";        
    public piezas:string = "";        
    public Peso:string = "";        

    Clean() {
        this.FechaSalida = "";    
        this.Folio = "";  
        this.Pedimento = "";  
        this.RFC = "";  
        this.Importe = "";  
        this.piezas = "";  
        this.Peso = "";  
    }
}

export class GetEstatusTransferencia {
    constructor() { }
    public Master:string = "";    
    public House:string = "";     
    public Referencia:string = "";    
    public InstruccionManejo:string = "";        
    public Prealerta:string = "";        
    public FechaPrealerta:string = "";        
    public Recoleccion:string = "";        
    public FechaRecoleccion:string = "";        
    public DocumentosDisponibles:string = "";        
    public FechaDocumentosDisponibles:string = "";        
    public CargaDisponible:string = "";        
    public FechaCargaDisponible:string = "";        

    Clean() {
        this.Master = "";    
        this.House = "";    
        this.Referencia = "";    
        this.InstruccionManejo = "";    
        this.FechaPrealerta = "";    
        this.Recoleccion = "";    
        this.FechaRecoleccion = "";    
        this.DocumentosDisponibles = "";    
        this.FechaDocumentosDisponibles = "";    
        this.CargaDisponible = "";    
        this.FechaCargaDisponible = "";    
    }
}

export class GetAWBByReference {
    constructor() { }
    public Referencia:string = "";    
    public Master:string = "";    
    public House:string = "";     

    Clean() {
        this.Master = "";    
        this.House = "";    
        this.Referencia = "";    
    }
}

export class CheckAWB {
    constructor() { }
    public Master:string = "";    
    public House:string = "";     
    public Piezas:string = "";     
    public Peso:string = "";     

    Clean() {
        this.Master = "";    
        this.House = "";    
        this.Piezas = "";    
        this.Peso = "";    
    }
}