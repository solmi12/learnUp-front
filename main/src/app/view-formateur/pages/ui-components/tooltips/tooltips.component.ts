import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tooltips-formateur',
  templateUrl: './tooltips.component.html',
})
export class AppTooltipsFormateurComponent {
  //  disabled
  disabled = new FormControl(false);

  // show and hide
  showDelay = new FormControl(1000);
  hideDelay = new FormControl(2000);

  // change message
  message = new FormControl('Info about the action');
}
