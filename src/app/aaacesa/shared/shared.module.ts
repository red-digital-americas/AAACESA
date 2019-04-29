import { NgModule } from '@angular/core';

//////////////
// Pipes
import { FileIconPipe } from './fileIcon.pipe';
import { StatusPipe } from './status.pipe';
import { FilterSelectPipe } from './filterSelect.pipe';

@NgModule({
  imports: [        
  ],
  declarations: [    
    FileIconPipe,
    StatusPipe,
    FilterSelectPipe
  ],
  exports: [
    FileIconPipe,
    StatusPipe,
    FilterSelectPipe
  ]
})
export class SharedModule { }
