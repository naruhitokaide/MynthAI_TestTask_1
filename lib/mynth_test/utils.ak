use aiken/list
use aiken/transaction.{Transaction}
use mynth_test/types.{VerificationKeyHash}

pub fn must_be_signed_by(transaction: Transaction, vk: VerificationKeyHash) {
  list.has(transaction.extra_signatories, vk)
}
