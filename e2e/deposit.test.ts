import { Blockfrost, Lucid } from 'https://deno.land/x/lucid@0.10.7/mod.ts';

// import colors
import * as colors from 'https://deno.land/std@0.218.2/fmt/colors.ts';

// import dotenv
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

// import utils
import {
  readValidator,
  getDepositorAddressDetails,
  makeDepositDatum,
  deposit,
} from './utils.ts';

// set up lucid and select wallet
const lucid = await Lucid.new(
  new Blockfrost(
    'https://cardano-preprod.blockfrost.io/api/v0',
    Deno.env.get('BLOCKFROST_API_KEY')
  ),
  'Preprod'
);
lucid.selectWalletFromPrivateKey(await Deno.readTextFile('./keys/key.sk'));

// set up validator
const validator = readValidator();

Deno.test('Deposit', async () => {
  // prepare contract, depositor
  console.log(colors.bold(colors.cyan('Prepare Contract, Depositor')));
  const contractAddress = lucid.utils.validatorToAddress(validator);
  const {
    address: depositorAddress,
    paymentCredential: depositorPaymentCredential,
  } = await getDepositorAddressDetails();
  console.log(`
    ${colors.magenta('Contract Address is')}: ${colors.bold(
    colors.brightGreen(contractAddress)
  )}\n
    ${colors.magenta('Depositor Address is')}: ${colors.bold(
    colors.brightGreen(depositorAddress)
  )}
`);

  // deposit
  console.log(colors.bold(colors.cyan('Deposit 100 tADA')));
  const depositDatum = makeDepositDatum(depositorPaymentCredential!);
  console.log(`
    ${colors.magenta('Deposit Datum is')}: ${colors.bold(
    colors.brightGreen(depositDatum)
  )}
`);
  const depositTxHash = await deposit({
    amount: 100000000n,
    contractAddress,
    datum: depositDatum,
    lucid,
  });
  console.log(`
    ${colors.magenta('Deposit Tx Hash is')}: ${colors.bold(
    colors.brightGreen(depositTxHash)
  )}
`);

  console.log(
    colors.bgYellow(colors.black('Waiting for deposit tx to be on chain...\n'))
  );
  await lucid.awaitTx(depositTxHash);
});
