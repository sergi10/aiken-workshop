use aiken/collection/dict
use aiken/collection/list
use cardano/transaction.{OutputReference, Transaction, InlineDatum}
use cardano/assets.{PolicyId, policies}
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Script, from_script}

pub type MintAction {
  Minting
  Burning
}

pub type SpendAction {
  Update
  Burn
}

validator oracle(utxo_ref: OutputReference, operator: VerificationKeyHash) {
 
  mint(action: MintAction, policy_id: PolicyId, self: Transaction) {
    let Transaction { inputs, outputs, mint, .. } = self
    let is_signed_by_operator =
      list.has(self.extra_signatories, operator)

    // Get the quantity of the token minted
    expect [Pair(_asset_name, quantity)] = mint
      |> assets.tokens(policy_id)
      |> dict.to_pairs()
    
    when action is {
      Minting ->{
        // Check the UTxO is consumed
        let is_output_consumed = list.any(inputs, fn(input) { input.output_reference == utxo_ref })

        // Check that the NFT has the correct datum
        expect Some(nft_output) =
          list.find(
            outputs,
            fn(output) { list.has(policies(output.value), policy_id) },
        )
    
        expect InlineDatum(datum) = nft_output.datum
        expect _rate: Int = datum

        // Ensure the NFT remains at the same address
        let policy_address = from_script(policy_id)
        expect nft_output.address == policy_address
        is_output_consumed? && (quantity == 1)? && is_signed_by_operator
      }
      Burning -> (quantity == -1)? && is_signed_by_operator
    }
  }

  spend(
    _optional_datum: Option<Data>,
    action: SpendAction,
    own_ref: OutputReference,
    self: Transaction,
  ) {
    // Checking if the transaction is signed by the operator.
    let is_signed_by_operator =
      list.has(self.extra_signatories, operator)

    when action is {
      Update -> {
        let Transaction { inputs, outputs, .. } = self 
        // Getting the script hash from this validator. Note that since the
        // `mint` handler is defined as part of the same validator, they share
        // the same hash digest. Thus, our `payment_credential` is ALSO our Oracle
        // minting policy.
        expect Some(own_input) =
          list.find(inputs, fn(input) { input.output_reference == own_ref })
        expect Script(own_script_hash) = own_input.output.address.payment_credential


        // One input should hold the NFT, with expected datum format.
        expect Some(nft_input) =
          list.find(
            inputs,
            fn(input) { list.has(policies(input.output.value), own_script_hash) },
          )

        expect InlineDatum(input_datum) = nft_input.output.datum
        expect _rate: Int = input_datum
    

        //// The NFT must be forwarded to an output
        expect Some(nft_output) =
        list.find(
          outputs,
          fn(output) { list.has(policies(output.value), own_script_hash) },
        )
        expect InlineDatum(output_datum) = nft_output.datum
        expect _rate: Int = output_datum
    
        expect nft_input.output.address == nft_output.address
        is_signed_by_operator? 
      }
      Burn -> {
        is_signed_by_operator? 
      }
    }
    
  }
}
