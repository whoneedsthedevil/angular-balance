import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { OPTIONS } from '../assets/OPTIONS';

export interface Data {
	name: string;
	count: number;
	items: Items[];
}

export interface Items {
	name: string;
	count: number;
	percent: number;
	isLocked?: boolean;
}

@Injectable()
export class OptionsService {

  constructor() { }

  getOptions(): Observable<Data[]> {
    return of(OPTIONS);
  }
}
