import { NgModule } from '@angular/core';

//////////////
// Pipes
import { FileIconPipe } from './fileIcon.pipe';
import { StatusPipe } from './status.pipe';
import { FilterSelectPipe } from './filterSelect.pipe';
import { DataFilterPipe } from './datafilterpipe';
import { GetSelectPipe } from './getSelect.pipe';
import { SeguimientoAccionesPipe } from './seguimientoAcciones.pipe';
import { FileIconStatusPipe } from './fileIconStatus.pipe';

@NgModule({
  imports: [        
  ],
  declarations: [    
    FileIconPipe,
    StatusPipe,
    FilterSelectPipe,
    DataFilterPipe,
    GetSelectPipe,
    SeguimientoAccionesPipe,
    FileIconStatusPipe
  ],
  exports: [
    FileIconPipe,
    StatusPipe,
    FilterSelectPipe,
    DataFilterPipe,
    GetSelectPipe,
    SeguimientoAccionesPipe,
    FileIconStatusPipe
  ]
})
export class SharedModule { }
