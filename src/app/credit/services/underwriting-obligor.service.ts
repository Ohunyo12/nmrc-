import { Injectable } from "@angular/core";
import { throwError as observableThrowError, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthHttp } from "../../admin/services/token.service";
import { AppConfigService } from "../../shared/services/app.config.service";
import { HttpParams } from "@angular/common/http";

let AppConstant: any = {};

@Injectable({
  providedIn: "root",
})
export class UnifiedUnderwritingStandardService {
  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  getLoanForRefinance(companyId: number) {
        return this.http.get(`${AppConstant.API_BASE}loan/get-applied-loans-summary-refinance/?companyId=${companyId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSummaryLoanDetails(refinanceNumber: string): Observable<any> {
      return this.http.get(`${AppConstant.API_BASE}loan/get-applied-loans-refinance?RefinanceNumbr=${refinanceNumber}`);
    }

    // approveChecklistLoan(RefinanceNumber: string): Observable<any> {
    //   return this.http.get(`${AppConstant.API_BASE}loan/Approve-pmb-customer-checklist`, {RefinanceNumber}) // Send the array directly

    // }

    approveChecklistLoan(RefinanceNumber: string): Observable<any> {
      return this.http.get(`${AppConstant.API_BASE}loan/Approve-pmb-customer-checklist/?RefinanceNumber=${RefinanceNumber}`) // Send the array directly
        .pipe(
          map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error'))
        );
    }

    getLoanSummary(companyId: number) {
      return this.http.get(`${AppConstant.API_BASE}loan/get-applied-loans-summary-refinance/?companyId=${companyId}`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
      }

  // ================================= PMB Underwriting Checklist =======================================

  // getDisbursedObligorUus() {
  //     return this.http.get(`${AppConstant.API_BASE}loan/get-obligor-uus`)
  //         .pipe(
  //       map((res: any) => res),
  //     catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  // }

getDisbursedObligorUus(NhfNumber: string) {

  return this.http
    .get(`${AppConstant.API_BASE}loan/get-obligor-uus/${NhfNumber}`)
    .pipe(
      map(res => res),
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  postCustomerUus(body: any) : Observable<any> {
    return this.http.post(`${AppConstant.API_BASE}loan/Post-Customer-uus`, body)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error'))
        );
}

getPmbSummaryLoanDetails(refinanceNumber: string): Observable<any> {
  return this.http.get(`${AppConstant.API_BASE}loan/get-pmb-checklisted-loan?RefinanceNumbr=${refinanceNumber}`);
}

getCustomerUusItemDoc(nhfNumber: string, itemId: number): Observable<any> {
  if (!nhfNumber || itemId == null) {
    console.error("Invalid parameters for API call:", nhfNumber, itemId);
    return throwError(() => new Error("Invalid parameters for API call"));
  }

  const url = `${AppConstant.API_BASE}loan/get-customer-uus-items-doc?NhfNumber=${nhfNumber}&ItemId=${itemId}`;
  console.log("API URL:", url);

  return this.http.post(url, null);
}


getCustomerUusItems(nhfNumber: string) {
  return this.http.get(`${AppConstant.API_BASE}loan/get-customer-uus-items/?NhfNumber=${nhfNumber}`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}


// getCustomerUusItems(nhfNumber: string) {
//   const params = new HttpParams().set('NhfNumber', nhfNumber);

//   return this.http.get(`${AppConstant.API_BASE}loan/get-customer-uus-items`, { params })
//       .pipe(
//     map((res: any) => res),
//   catchError((error: any) => observableThrowError(error.error || 'Server error')),);
// }





// ========================== PMB Approval for Refinancing =============================

// approvePmbRefinancing(body: number): Observable<any> {
//   return this.http.post(`${AppConstant.API_BASE}loan/Approve-pmb-refinance`, body) // Send the array directly
//     .pipe(
//       map((res: any) => res),
//       catchError((error: any) => observableThrowError(error.error || 'Server error'))
//     );
// }

approvePmbRefinancing(body: number): Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/Approve-pmb-refinance/?Model=${body}`,{})
      .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}



getPmbsChecklistedLoanSummary(companyId: number) {
  return this.http.get(`${AppConstant.API_BASE}loan/get-pmb-checklisted-loan-summary/?companyId=${companyId}`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

getPmbsChecklistedLoan(refinanceNumber: string): Observable<any> {
  return this.http.get(`${AppConstant.API_BASE}loan/get-pmb-checklisted-loan?RefinanceNumber=${refinanceNumber}`)
  .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}




// getPmbsChecklistedLoan1(RefinanceNumber: string): Observable<any> {
//   debugger
//   return this.http.get(`${AppConstant.API_BASE}loan/get-pmb-checklisted-loan?RefinanceNumbr=${RefinanceNumber}`)
//   .pipe(
//     map((res: any) => res),
//   catchError((error: any) => observableThrowError(error.error || 'Server error')),);
// }
getPmbsChecklistedLoan1(refinanceNumbers: string[]): Observable<any> {
  debugger
  const params = new HttpParams({
    fromObject: { RefinanceNumber: refinanceNumbers }  // This will create multiple query params
  });

  return this.http.get(`${AppConstant.API_BASE}loan/get-pmb-checklisted-loan/`, { params })
    .pipe(
      map((res: any) => res),
      catchError((error: any) => {
        console.error('Error in getPmbsChecklistedLoan:', error);
        return throwError(() => error.error || 'Server error');
      })
    );
}



// ========================== Pending Refinancing ==================================

getLoanDetails(RefNo: string): Observable<any> {
  return this.http.get(`${AppConstant.API_BASE}loan/get-applied-subloan-nmrcrefinance?RefNo=${RefNo}`);
}

getLoanDetailsNew(RefNumber: string): Observable<any> {
  debugger
  return this.http.get(`${AppConstant.API_BASE}loan/get-subloan-for-reviewal?RefNumber=${RefNumber}`);
}

getAppliedLoanForNmrcRefinance(page: number) {
return this.http.get(`${AppConstant.API_BASE}loan/get-loan-summary-nmrcreviewal`)
    .pipe(
  map((res: any) => res),
catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}


// ============================ NMRC Reviewer =====================================

approveReviewLoan(body: number[]): Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-reviewal-approval`, body) // Send the array directly
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

SendReviewForFinalApproval(refinanceNumber: string): Observable<any> {
  debugger
  return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-send-reviewed-batch?RefinanceNumber=${refinanceNumber}`, null) // Send the array directly
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

approveReviewLoanFinal(body: number[]): Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/subloan-approval`, body) // Send the array directly
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

disapproveReviewLoan(body: number[]): Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-reviewal-disapproval`, body)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

reviewCustomersUUSItems(body: any) : Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-customer-uusiems-reviewal`, body)
      .pipe(
          map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error'))
      );
  }



  getAppliedLoanForNmrcReviewal(): Observable<any> {
    return this.http.get(`${AppConstant.API_BASE}loan/get-loan-summary-nmrcreviewal`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error'))
      );
  }

  getSubLoanForNmrcReview(refinanceNumber: string): Observable<any> {
    return this.http.get(`${AppConstant.API_BASE}loan/get-subloan-for-reviewal?RefNumber=${refinanceNumber}`)
    .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  // ============================ Final NMRC Approval for Loan(s) Refinancing =================================



approveReviewedLoan(body: number[]): Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/subloan-approval`, body)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

disapproveReviewedLoan(body: number[]): Observable<any> {
  return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-reviewal-disapproval`, body)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

getReviewedSumForNmrcApproval() {
  return this.http.get(`${AppConstant.API_BASE}loan/get-reviewed-sum-nmrcapproval`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

getReviewedForApproval(refinanceNumber: string): Observable<any> {
  return this.http.get(`${AppConstant.API_BASE}loan/get-reviewed-sub-nmrcapproval?RefinanceNumber=${refinanceNumber}`)
  .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

DisburseApprovedRefinance(RefinanceNumber: string): Observable<any> {
  debugger
  return this.http.post(`${AppConstant.API_BASE}loan/disburse-refinanced-loan`, {RefinanceNumber})
    .pipe(
      map((res: any) => res),
      catchError((error: any) => throwError(() => new Error(error.error || 'Server error')))
    );
}

TranchLoan(loanRefinanceNumber: string[]): Observable<any> {
  debugger
  return this.http.post(`${AppConstant.API_BASE}loan/tranch-approved-loan`, loanRefinanceNumber)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => throwError(() => new Error(error.error || 'Server error')))
    );
}

// BookLoanNMRC(LoanId: number): Observable<any> {
//   debugger
//   return this.http.get(`${AppConstant.API_BASE}loan/loan-booking-nmrc/?LoanId=${LoanId}` )
//     .pipe(
//       map((res: any) => res),
//       catchError((error: any) => throwError(() => new Error(error.error || 'Server error')))
//     );
// }
// ================================ Tranched Loans ===========================

getTranchedLoans(): Observable<any> {
  return this.http.get(`${AppConstant.API_BASE}loan/get-tranchedLoans`)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

generatePeriodicLoanScheduleNMRC(body: any): Observable<any> {
  return this.http
    .post(`${AppConstant.API_BASE}loan/periodic-schedule-nmrc`, body)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}
BookLoanNMRC(loanId: number): Observable<any> {
  debugger;
  return this.http.post(`${AppConstant.API_BASE}loan/loan-booking-nmrc`, loanId ) // Send LoanId in body
    .pipe(
      map((res: any) => res),
      catchError((error: any) => throwError(() => new Error(error.error || 'Server error')))
    );
}

getLoanSchedule(loanId: any[]): Observable<any> {
  debugger
  return this.http.get(`${AppConstant.API_BASE}loan/get-loan-schedule-nmrc/?loanId=${loanId}`, )
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}




NmrcLoanDisbursment(LoanId: number): Observable<any> {
  debugger;
  return this.http.post(`${AppConstant.API_BASE}loan/disburse-loan-nmrc`, LoanId ) // Send LoanId in body
    .pipe(
      map((res: any) => res),
      catchError((error: any) => throwError(() => new Error(error.error || 'Server error')))
    );
}
GetSubLoanForNmrcReview(page: number) {
  return this.http.get(`${AppConstant.API_BASE}loan/get-subloan-for-reviewal`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

GetAppliedLoanForNmrcRefinance(page: number) {
  return this.http.get(`${AppConstant.API_BASE}loan/get-summary-loan-nmrctranch`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

GetScheduledLoanForBooking(page: number) {
  return this.http.get(`${AppConstant.API_BASE}loan/get-loan-for-booking-nmrc`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

GetScheduledLoanForDisbursement(page: number) {
  return this.http.get(`${AppConstant.API_BASE}loan/get-loan-for-disbursement-nmrc`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

GetSubLoanForDisbursement(RefNo: string): Observable<any> {
  return this.http.get(`${AppConstant.API_BASE}loan/get-applied-subloan-nmrctranch?RefNo=${RefNo}`);
}

postLoanTerms(body: any): Observable<any> {
  return this.http
    .post(`${AppConstant.API_BASE}loan/post-loan-terms`, body)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error'))
    );
}

  sendReviewForFinalApproval(refinanceNumber: string): Observable<any> {
    debugger
    return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-send-reviewed-batch?RefinanceNumber=${refinanceNumber}`, null) // Send the array directly
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error'))
      );
  }

  approveFinalReviewedLoan(body: number[]): Observable<any> {
    return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-approve-reviewed`, body)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error'))
      );
  }

  disapproveFinalReviewedLoan(body: number[]): Observable<any> {
    return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-disapprove-reviewed`, body)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error'))
      );
  }

  sendLoanForTranch(refinanceNumber: string): Observable<any> {
    debugger
    return this.http.post(`${AppConstant.API_BASE}loan/Nmrc-send-approved-batch?RefinanceNumber=${refinanceNumber}`, null) // Send the array directly
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error'))
      );
  }

}