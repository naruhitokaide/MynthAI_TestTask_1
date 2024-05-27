import {
  Blockfrost,
  Data,
  Lucid,
} from 'https://deno.land/x/lucid@0.10.7/mod.ts';

// import colors
import * as colors from 'https://deno.land/std@0.218.2/fmt/colors.ts';

// import dotenv
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

// import utils
import { readValidator } from './utils.ts';
import { withdraw } from './utils.ts';

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

// withdraw success test case
Deno.test('Withdraw Success', async () => {
  // prepare contract, withdrawer
  console.log(colors.bold(colors.cyan('Prepare Contract, Withdrawer')));
  const contractAddress = lucid.utils.validatorToAddress(validator);
  console.log(`
    ${colors.magenta('Contract Address is')}: ${colors.bold(
    colors.brightGreen(contractAddress)
  )}\n
    ${colors.magenta('Withdrawer Address is')}: ${colors.bold(
    colors.brightGreen(await lucid.wallet.address())
  )}
  `);

  // withdraw
  const depositTxHash = Deno.args[0] || '';
  console.log(colors.bold(colors.cyan('Withdraw 100 tAda')));
  console.log(
    `${colors.magenta('Deposit Tx Hash is')}: ${colors.bold(
      colors.brightGreen(depositTxHash)
    )}`
  );
  const scriptUtxos = await lucid.utxosAt(contractAddress);
  const foundUtxo = scriptUtxos.find((e) => e.txHash == depositTxHash);

  if (!foundUtxo) {
    throw new Error('Deposit Tx Not Found');
  }

  const withdrawTxHash = await withdraw({
    utxos: [foundUtxo!],
    spendingValidator: validator,
    redeemer: Data.void(),
    lucid,
  });

  console.log(`
    ${colors.magenta('Withdraw Tx Hash is')}: ${colors.bold(
    colors.brightGreen(withdrawTxHash)
  )}
  `);
});
