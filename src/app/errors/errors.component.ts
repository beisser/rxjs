import { Component, OnInit } from '@angular/core';
import {interval, noop, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // this.catchErrorAndRecoverExample();
    // this.catchErrorAndRethrowExample();
    this.catchErrorAndRetryExample();
    // this.finalizeExample();
  }

  /**
   * CATCH ERROR OPERATOR: ERROR HANDLING STRATEGY: RECOVER
   *
   * catches the error if it occurs and can return an observable with an alternative value
   * for the given observable
   */
  catchErrorAndRecoverExample() {
    const http$ = this.httpClient.get('www.google.de').pipe(
      // return an observable with an empty object
      // DOES NOT NEED TO BE build with of() -> any observable e.g. from another method can be returned
      catchError(err => of({}))
    );
    http$.subscribe(value => console.log(value), noop, noop);
  }

  /**
   * CATCH ERROR OPERATOR: ERROR HANDLING STRATEGY: RETHROW
   *
   * catches the error if it occurs and returns a new observable which errors out immediately with the
   * same error
   *
   * good to perfom some logging if an error occurs before rethrowing the error
   *
   */
  catchErrorAndRethrowExample() {
    const http$ = this.httpClient.get('www.google.de').pipe(

      catchError(err => {
        console.log(err);

        // creates an observable which errors out without emitting any value
        return throwError(err);
      })
    );
    http$.subscribe(value => console.log(value), noop, noop);
  }

  /**
   * RETRY WHEN OPERATOR: ERROR HANDLING STRATEGY: RETRY
   *
   * if an error occurs the observable is retried after an amount of seconds.
   *
   * retryWhen returns an observable which emits errors and creates a brand new data stream
   * after an amount of time
   */
  catchErrorAndRetryExample() {
    const http$ = this.httpClient.get('www.google.de').pipe(
      // receives an error observable, which emits an error each time the observable fails
      retryWhen(error$ => error$.pipe(
        delayWhen(() => timer(2000))
      ))
    );
    http$.subscribe(value => console.log(value), noop, noop);
  }

  /**
   * FINALIZE OPERATOR
   *
   * this operator is called in both cases: if the observable completes or if the observable errors out
   *
   * good to perform clean up
   *
   */
  finalizeExample() {
    const http$ = this.httpClient.get('www.google.de').pipe(
      catchError(err => {
        console.log(err);

        // creates an observable which errors out without emitting any value
        return throwError(err);
      }),
      finalize(() => console.log('clean up'))
    );
    http$.subscribe(value => console.log(value), noop, noop);
  }


}
