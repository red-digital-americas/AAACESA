import { Observable } from "rxjs/Observable";

export class LoginServices{

    usuario;
    pasword;
    users = [
        {
            Correo: 'kfigueroa@indracompany.com',
            Password:'IndraCompn',
            CveEstatus: 'B',
            Detalle:'El usuario está bloqueado',
            IdCliente: '259',
            isAuth:'false'
        },
        {
            Correo: 'tester.indra.aaacesa@gmail.com',Password:'IndraCompany',
            CveEstatus: 'A',
            Detalle:'',
            IdCliente: '258',
            isAuth:'true'
        },
        {
            Correo: 'admin@demo.com',
            Password:'demo',
            CveEstatus: null,
            Detalle:'El usuario no existe',
            IdCliente: '',
            isAuth:''
        }
    ];

    loginAuth(nameUser: string, passwUser: string){
        
        this.usuario = this.users.filter(x => x.Correo == nameUser)[0];
        

        if(nameUser == this.usuario['Correo'])
        {
            return this.usuario;
        }
    }
    getDetalleUser(id):Observable<any> {
        this.usuario = {
            Nombre:"ARMANDO",
            Paterno:"MADRIGAL",
            Materno: "HERNANDEZ",
            CvePerfil:"MAESTRO",
            TipoCliente:"AA",
            RazonSocial:"AGENCIA ADUANAL OCAMPO YUDICO SC",
            ClavePatente:"3763",
            NumCuentas:"5",
            IdCliente:"258",
            GetFotoPerfil:"assets/img/avatars/armando.jpg"
        }
        return this.usuario;
    }

}