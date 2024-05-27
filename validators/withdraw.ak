use aiken/transaction.{ScriptContext, Spend}
use mynth_test/types.{DepositDatum}
use mynth_test/utils.{must_be_signed_by}

validator {
  fn withdraw(datum: DepositDatum, _redeemer: Void, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx

    when purpose is {
      Spend(_) -> must_be_signed_by(transaction, datum.depositor)
      _ -> False
    }
  }
}
