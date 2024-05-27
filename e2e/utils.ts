import {
  Constr,
  Credential,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  UTxO,
  generatePrivateKey,
  getAddressDetails,
} from 'https://deno.land/x/lucid@0.10.7/mod.ts';

import blueprint from '../plutus.json' assert { type: 'json' };

export function readValidator(): SpendingValidator {
  const validator = blueprint.validators[0];
  return {
    type: 'PlutusV2',
    script: validator.compiledCode!,
  };
}

export async function generateRandomAddressDetails(): Promise<{
  address: string;
  paymentCredential?: Credential;
}> {
  const l = await Lucid.new(undefined, 'Preprod');
  const privateKey = generatePrivateKey();
  const address = await l
    .selectWalletFromPrivateKey(privateKey)
    .wallet.address();
  const { paymentCredential } = getAddressDetails(address);

  return { address, paymentCredential };
}

export async function getDepositorAddressDetails(): Promise<{
  address: string;
  paymentCredential?: Credential;
}> {
  const address = await Deno.readTextFile('./keys/key.addr');
  const { paymentCredential } = getAddressDetails(address);
  return {
    address,
    paymentCredential,
  };
}

export function makeDepositDatum(paymentCredential: Credential): string {
  const depositDatum = Data.to(new Constr(0, [paymentCredential.hash]));
  return depositDatum;
}

export async function deposit({
  amount,
  contractAddress,
  datum,
  lucid,
}: {
  amount: bigint;
  contractAddress: string;
  datum: string;
  lucid: Lucid;
}): Promise<TxHash> {
  const tx = await lucid
    .newTx()
    .payToContract(
      contractAddress,
      {
        inline: datum,
      },
      {
        lovelace: amount,
      }
    )
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
}

export async function withdraw({
  utxos,
  spendingValidator,
  redeemer,
  lucid,
}: {
  utxos: UTxO[];
  spendingValidator: SpendingValidator;
  redeemer: string;
  lucid: Lucid;
}): Promise<TxHash> {
  const tx = await lucid
    .newTx()
    .collectFrom(utxos, redeemer)
    .addSigner(await lucid.wallet.address())
    .attachSpendingValidator(spendingValidator)
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
}
