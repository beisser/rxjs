import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private subject = new BehaviorSubject<number[]>([0]);

  // return the main data stream
  numbers$: Observable<number[]> = this.subject.asObservable();

  // could be an http request
  refreshNumbers() {
    const new$ = of([1, 2, 3]);

    new$.subscribe(value => this.subject.next(value));
  }

  // return specific data stream based on main data stream
  multiplyBy(multiplier: number) {
    return this.numbers$.pipe(
      map(values => values.map(x => x * multiplier))
    );
  }

  edit(toEdit: number) {

    // modify in memory data
    const numbers = this.subject.getValue();

    const newNumbers = numbers.slice(0);
    newNumbers[1] = 7;

    this.subject.next(newNumbers);

    // TODO save to the backend
  }
}
