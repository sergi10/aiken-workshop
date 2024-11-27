validator always_false {
  spend(_optional_datum: Option<Data>,
    _redeemer: Data,
    _own_ref: Data,
    _self: Data){
    False || False
  }  
}