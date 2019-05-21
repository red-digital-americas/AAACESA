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

export class BitacoraResult{
    constructor(){}
    public FechaCreacion:string = "";    
    public Nombre:string = "";        
    public Correo:string = "";    
    public Modulo:string = "";    
    public Accion:string = "";    
    public Detalle:string = "";    

    Clean() {
        this.FechaCreacion = "";    
        this.Nombre = "";        
        this.Correo = "";    
        this.Modulo = "";    
        this.Accion = "";    
        this.Detalle = "";    
    }
}

export class CalculoManiobra {
    constructor() { }    
    public Master:string = "";    
    public House:string = "";    
    public TipoEntrada:string = "";    
    public Peso:string = "";        
    public ValorAduana:string = "";    
    public FechaEntrada:string = "";    
    public FechaSalida:string = "";    
    public ConceptoCadenaFria:string = "";    

    Clean() {
        this.Master = "";    
        this.House = "";    
        this.TipoEntrada = "";    
        this.Peso = "";        
        this.ValorAduana = "";    
        this.FechaEntrada = "";    
        this.FechaSalida = "";    
        this.ConceptoCadenaFria = "";    
    }
}

export class ResCalculoManiobra {
    constructor() { }    
    public CostoAlmacenaje:string = "";    
    public CostoCustodia:string = "";        
    public CostoManiobra:string = "";    
    public CostoRefrigeracion:string = "";    
    public CostoCongelacion:string = "";    
    public CostoTEC:string = "";    
    public CostoPrevio:string = "";    
    public Subtotal:string = "";    
    public IVA:string = "";    
    public Total:string = "";    

    Clean() {
        this.CostoAlmacenaje = "";    
        this.CostoCustodia = "";        
        this.CostoManiobra = "";    
        this.CostoRefrigeracion = "";    
        this.CostoCongelacion = "";    
        this.CostoTEC = "";    
        this.CostoPrevio = "";    
        this.Subtotal = "";    
        this.IVA = "";    
        this.Total = "";    
    }
}

