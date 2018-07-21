import { Component, OnInit } from '@angular/core';
import {interval, noop, Observable, from } from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
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
    // this.filterExample();
    this.shareReplayExample();
    // this.tapExample();
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
   * FILTER OPERATOR
   *
   * the map operator can also be used to filter a collection
   */
  filterExample() {
    const numbers$ = from(Array(Array(1, 2, 3, 4, 5)));
    const filteredNumbers$ = numbers$.pipe(
      map(numbers => numbers.filter(number => number % 2 === 0))
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
   */
  shareReplayExample() {

    const http$ = this.httpClient.get('www.google.de').pipe(
      shareReplay()
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
}
