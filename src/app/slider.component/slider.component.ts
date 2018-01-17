import { Component, OnInit } from '@angular/core';
import { Data, Items, OptionsService } from '../options.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  Data: Data[] = [];
  isLocked: boolean = false;

  setLock(state: boolean, parentIndex, childIndex) {
  	this.Data[parentIndex].items[childIndex].isLocked = state;
  }

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
  	this.getOptions();
  }

  getOptions(): void {
    this.optionsService.getOptions()
      .subscribe(options => {
         options.forEach(section => {

    		section.count = 0;
    		section.items.forEach( item => section.count += item.count );

    		section.items.forEach( item => {
    			item.percent = +(100*(item.count/section.count)).toFixed(2)
    			item.isLocked = this.isLocked;
    			})

    		this.Data.push(section);
    	  })
    	})
    };

	perChanging(event, parentIndex, childIndex): void {

		const sliders = this.Data[parentIndex];
		const el = this.Data[parentIndex].items[childIndex];
		const percents = this.percentsCalc(sliders.items);
		const counts = this.countCalc(sliders.count, percents);
		const prevPercent = el.percent;

		let isSingle = this.checkIsSingle(sliders.items);
		let value: number;

		if (event.srcElement && event.srcElement.name === 'counts') {
			value = +(event.target.value * 100 / sliders.count).toFixed(2);
			console.log(value);
		} else {
			value = event.target ? +event.target.value : event.value;
		}

		if (value > percents || isSingle) {
			this.boundsWatcher(el, percents, value, isSingle, counts);
		} else {
			el.count = this.countCalc(counts, value);
			el.percent = +(value).toFixed(2);
		}
		
		let deltaPercent = prevPercent - value;
		this.setOtherVals(deltaPercent, sliders, childIndex, percents);
	}

	setOtherVals(delta, sliders: Data, childI: number, percents) {

	    let isEditing = true;
		let interVals = sliders.items.filter( (val, index) => !(index == childI || val.isLocked) );


		const makeChanges = () => {

			interVals.sort( (a, b) => delta > 0 ? a.percent - b.percent : b.percent - a.percent );

			let exVal = interVals.length > 0 ? interVals[0].percent : false;

			sliders.items.map( (val, index) => {

				let rule = index !== childI && val.percent === exVal && !val.isLocked;;
				let overRange = val.percent + delta > percents;
				let underRange = val.percent + delta < 0;

				if (rule && isEditing) {

				  if (overRange) {
				    delta = val.percent + delta - percents;
				    val.percent = +percents.toFixed(2);
					val.count = this.countCalc(sliders.count, val.percent);
				  }
				  if (underRange) {
				  	delta = +(val.percent + delta).toFixed(2);
				  	val.percent = 0;
					val.count = 0;
				  }
				  if (!(underRange || overRange)) {
					val.percent = +(val.percent + delta).toFixed(2);
					val.count = this.countCalc(sliders.count, val.percent);
					isEditing = false
				  }

				}
			})
		}
		let i = 0;
		let len = sliders.items.length;
		while (i < len && isEditing) {
			i++;
			makeChanges();
		}

		return sliders;

	}

	boundsWatcher(el, percents, value, isSingle, counts) {
		let tick = 500;
		let checkBounds = () => {
			let rule = el.percent > percents || (isSingle && el.percent !== percents);

			if (rule) {
				el.percent = percents;
				el.count = counts;
				value = percents;
			} else {
				clearInterval(watchBounds);
			}
		}

		let watchBounds = setInterval(() => checkBounds(), tick);
		    tick = 3200;
	}

	checkIsSingle(items) {
		return items.filter(val => !val.isLocked).length === 1 ? true : false;
	}

	countCalc(summ, val): number {
	  return Math.round(summ * ( val/100));
	}

	percentsCalc(items): number {
		let percents = 100;
			items.map( slider => {
				if (slider.isLocked) {
					percents -= slider.percent
				}
			});
		return +(percents).toFixed(2);
	}

}