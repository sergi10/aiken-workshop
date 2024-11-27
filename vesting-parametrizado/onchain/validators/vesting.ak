use cardano/transaction.{OutputReference, Transaction}
// Importing utils module from the library.
use utils.{VestingParameters, is_after_deadline, is_signed_by}

validator vesting {
  spend(
    // The datum (beneficiary and deadline data) is attached to the UTxO on-chain and will be defined by the person locking 
    // the tokens in the Smart Contract.
    opt_datum: Option<VestingParameters>,
    _redeemer: Data,
    _output_ref: OutputReference,
    self: Transaction,
  ) {
    expect Some(datum) = opt_datum
    and {
      // The transaction must be signed by the beneficiary.
      is_signed_by(datum.beneficiary, self.extra_signatories)?,
      // '?' operator can be appended to any boolean expression and will trace the expression only if it evaluates to False.

      // The transaction must occur after the deadline
      is_after_deadline(self.validity_range, datum.deadline_posix)?
    }
  }
}