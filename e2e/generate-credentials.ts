import { Lucid } from 'https://deno.land/x/lucid@0.10.7/mod.ts';

const lucid = await Lucid.new(undefined, 'Preprod');

const privateKey = lucid.utils.generatePrivateKey();
await Deno.writeTextFile('keys/key.sk', privateKey);

const address = await lucid
  .selectWalletFromPrivateKey(privateKey)
  .wallet.address();
await Deno.writeTextFile('keys/key.addr', address);

const otherPrivateKey = lucid.utils.generatePrivateKey();
await Deno.writeTextFile('keys/otherKey.sk', otherPrivateKey);

const otherAddress = await lucid
  .selectWalletFromPrivateKey(otherPrivateKey)
  .wallet.address();
await Deno.writeTextFile('keys/otherKey.addr', otherAddress);
