import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'autoTranslate'
})
export class AutoTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): string {
    if (!value) return value;

    // Generate the key by converting to uppercase and replacing spaces with underscores
    const key = value.toUpperCase().replace(/\s+/g, '_');
    
    // Check if the key exists in the translation dictionary
    const translation = this.translateService.instant(key);

    // If a translation is found, return it; otherwise, return the original value
    return translation !== key ? translation : value;
  }
}
