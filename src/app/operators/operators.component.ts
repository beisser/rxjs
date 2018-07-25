import { Component, OnInit } from '@angular/core';
import {interval, noop, Observable, from, of, concat, merge} from 'rxjs';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mergeMap,
  shareReplay, startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
/**
 * operators in general transform one observable into another one
 */
export class OperatorsComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // this.mapExample();
    // this.mapWithFilterExample();
    // this.filterExample();
    // this.shareReplayExample();
    // this.tapExample();
    // this.concatExample();
    // this.concatMapExample();
    // this.mergeExample();
    // this.mergeMapExample();
    // this.exhaustMapExample();
    // this.cancelSubscriptionExample();
    // this.debounceTimeExample();
    // this.distinctUntilChainedExample();
    // this.switchMapExample();
    this.startWithExample();
  }

  /**
   * MAP OPERATOR
   *
   * the map operator transforms each value emitted by an observable using a given function
   */
  mapExample() {
    const interval$ = interval(1000).pipe(
      map(value => value * 10),
    );

    interval$.subscribe(value => console.log(value), noop, noop);
  }

  /**
   * MAP OPERATOR WITH A FILTER
   *
   * the map operator can also be used to filter a collection
   */
  mapWithFilterExample() {
    const numbers$ = from(Array(Array(1, 2, 3, 4, 5)));
    const filteredNumbers$ = numbers$.pipe(
      map(numbers => numbers.filter(number => number % 2 === 0))
    );

    filteredNumbers$.subscribe(value => console.log(value), noop, noop);
  }

  /**
   * FILTER OPERATOR
   *
   * the filter operator removes values not passing the predicate test from the data stream
   */
  filterExample() {
    const numbers$ = of(1, 2, 3);
    const filteredNumbers$ = numbers$.pipe(
      filter(x => x > 2)
    );

    filteredNumbers$.subscribe(value => console.log(value), noop, noop);
  }

  /**
   * SHARE REPLAY OPERATOR
   *
   * multiple subscriptions to the same observable are creating multiple instances/ multiple streams of data
   * in the context of an http request multiple calls to the backend are the result, which is not what we want
   *
   * the shareReplay operator solves this problem
   * this operator shares one stream of data over multiple instances
   * it opens one stream of data, and replays this stream of data to all instances
   *
   * IMPORTANT: any operators before the shareReplay() will be 'shared', operators after the shareReplay() will
   * be executed for each subscription!!!
   */
  shareReplayExample() {

    const http$ = this.httpClient.get('www.google.de').pipe(
      // only executed once no matter how many subscriptions are active
      tap(x => console.log('only once')),
      shareReplay(),
      // will be executed for each subscription
      tap(x => console.log('foreach sub'))
    );

    const first$ = http$;
    const second$ = http$;

    first$.subscribe(value => console.log(value), error => console.log(error), noop);
    second$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * TAP OPERATOR
   *
   * operator to produce side effects e.g.
   *    updating a varibale outside of the observable
   *    log to the console
   */
  tapExample() {
    const interval$ = interval(1000);

    const byTen$ = interval$.pipe(
      tap(() => console.log('value emitted'))
    );

    byTen$.subscribe();
  }

  /**
   * CONCAT OPERATOR
   *
   * allows to concat multiple observables
   * the first observable emits values until it completes, then the next
   * observable emits its values until it completes and so on
   *
   * IMPORTANT: the previous observable has to complete for the next observable to emit its values
   *
   * useful if one observable must be completed before another one to fire (observables
   * occur one after another)
   *
   * to prevent nested subscribe concat is used
   * a use case can be the validation of a form (first observable) concated with the backend call to save
   * (second observable)
   *
   */
  concatExample() {
    const first$ = of(1, 2, 3);
    const second$ = of(4, 5, 6);

    const result$ = concat(first$, second$);

    result$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * CONCATMAP OPERATOR
   *
   * maps each value of an observable to an inner observable
   *
   * the next value of the observable is only emitted if the inner observable is completed
   *
   * useful if one observable must be completed before another one to fire (observables
   * occur one after another)
   *
   * use case: if an specific operation (e.g. a save operation) is required for a certain value
   * before the next emitted value is handled
   *  validation of a form (first observable)
   *  call the backend call to save(second observable)
   *  -> the save operation must be completed before a new validation is triggered
   */
  concatMapExample() {
    const first$ = of(1, 2, 3).pipe(
      concatMap(value => this.multiply(value))
    );
    first$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  multiply(multiplyBy: number) {
    return of(1, 2, 3).pipe(
      map(x => x * multiplyBy)
    );
  }

  /**
   * MERGE OPERATOR
   *
   * runs multiple observables in parallel
   *
   * as soon as one of the merges observables emits a value the merged one emits it too
   * only completes if all observables are completed
   *
   * perfect for running long running tasks in parallel
   */
  mergeExample() {
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(
      map(x => x * 10)
    );

    const result$ = merge(interval1$, interval2$);

    result$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * MERGEMAP OPERATOR
   *
   * runs multiple observables in parallel and emits the results as they arrive from the
   * different observables
   *
   * flattens all inner observables
   *
   * values from all inner observables are emitted without the need to wait for the completion of other ones
   */
  mergeMapExample() {
    const first$ = of(1, 2, 3).pipe(
      mergeMap(value => this.multiply(value))
    );
    first$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * EXHAUSTMAP OPERATOR
   *
   * as long as an inner observable is running new values emitted from the outer observable are ignored and
   * discarded meaning this values will never be processed by inner observables (the last part is the difference
   * to concatMap where the values are not ignored but processed after the completion)
   *
   * good for a save button which saves data to the backend. As long as the data is not saved additional clicks
   * should not be handled
   */
  exhaustMapExample() {
    const first$ = of(1, 2, 3).pipe(
      exhaustMap(value => this.multiply(value))
    );
    first$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * CANCEL SUBSCRIPTION
   *
   * to unsubscribe / cancel an observable subscription we need to store a reference to it
   */
  cancelSubscriptionExample() {
    const interval1$ = interval(1000);

    const sub = interval1$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 5000);
  }

  /**
   * DEBOUNCETIME OPERATOR
   *
   * adds a deplay. a value is not emitted immediately but only when the given deplay is over AND if there is
   * no new value emitted during the delay. If a new value is emitted during the delay the previous one is dropped and the new
   * value will be emitted when the delay is over. In this case the delay starts over again.
   */
  debounceTimeExample() {
    const interval1$ = interval(1000).pipe(
      debounceTime(100)
    );

    const sub = interval1$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 5000);
  }

  /**
   * DISTINCTUNTILCHANGED OPERATOR
   *
   * if the next value to be emitted equals the one previously emitted the value will not be emitted
   *
   * prevents duplicate values
   */
  distinctUntilChainedExample() {
    const first$ = of(1, 2, 2, 3).pipe(
      distinctUntilChanged()
    );
    first$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * SWITCHMAP OPERATOR
   *
   * enables to pass the emitted values from the outer observable to the inner observable but returns the inner observable /
   * the inner data stream as a result of the outer observable
   *
   * if the inner observable is not completed and a new value is emitted from the outer observable switchMap automatically
   * unsubscribes / cancels the running inner observable and starts a new inner observable with the new value from the
   * outer observable
   *
   * e.g. perfect for autocomplete because an not completed search is cancelled if a new search term arrives. A new search
   * is triggered with the new value
   */
  switchMapExample() {
    const first$ = of(1, 2, 3).pipe(
      switchMap(value => of( value + 1))
    );
    first$.subscribe(value => console.log(value), error => console.log(error), noop);
  }

  /**
   * START WITH OPERATOR
   *
   * set an initial value for the stream
   */
  startWithExample() {
    const first$ = of(1, 2, 3).pipe(
      startWith('start'),
      switchMap(value => of( value + 1))
    );
    first$.subscribe(value => console.log(value), error => console.log(error), noop);
  }
}
