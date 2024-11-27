use cardano/transaction.{OutputReference, Transaction}
use utils.{VestingParameters, is_after_deadline, is_signed_by}

// When changing the values of a parameterized validator,
// the smart contract will be attached to a new address.
validator vesting(params: VestingParameters) {
  spend(
    _opt_datum: Option<Data>,
    _redeemer: Data,
    _output_ref: OutputReference,
    self: Transaction,
  ) {
    and {
      is_signed_by(params.beneficiary, self.extra_signatories)?,
      is_after_deadline(self.validity_range, params.deadline_posix)?,
    }
  }
}
