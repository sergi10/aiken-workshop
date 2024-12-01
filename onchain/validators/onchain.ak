use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

pub type Datum {
  owner: VerificationKeyHash,
}

pub type Redeemer {
  msg: ByteArray,
}

pub type Data {
  shared: ByteArray,
}

validator hello_world {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    // expect Some(Datum { owner }) = datum
    let must_say_hello = redeemer.msg == "Hello, World!"
    // let must_be_signed = list.has(self.extra_signatories, owner)
    // must_say_hello && must_be_signed
    must_say_hello
  }

  else(_) {
    fail
  }
}

validator buenos_aires {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    // expect Some(Datum { owner }) = datum
    let must_say_hello = redeemer.msg == "Buenos Aires!"
    // let must_be_signed = list.has(self.extra_signatories, owner)
    // must_say_hello && must_be_signed
    must_say_hello
  }

  else(_) {
    fail
  }
}

validator datum_equals_redeemer {
  spend(
    datum: Option<Datum>,
    redeemer: Data,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    // expect Some(Datum { owner }) = datum
    let must_say_hello = redeemer.msg == "Hello, World!"
    // let must_be_signed = list.has(self.extra_signatories, owner)
    // must_say_hello && must_be_signed
    must_say_hello
  }

  else(_) {
    fail
  }
}
