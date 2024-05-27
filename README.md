
# Mynth AI Test

## Set Up Environment

To build aiken smart contract, run following command.

```bash
aiken build
```

Go to test directory

```bash
cd e2e
```

Make the env file

```bash
touch .env
```

And copy following content to `.env` file

```
BLOCKFROST_API_KEY = "${YOUR_BLOCKFROST_PREPROD_API_KEY}"
```

## Running Test cases

`in the e2e/ directory`

### *Run deposit test case*

```bash
deno task test:deposit
```

Output looks like This

```
Prepare Contract, Depositor

    Contract Address is: addr_test1wq2f4n4smsj47su5p6ugt0sdjgz7gwzce2d3n8mycdktjhcrzwghl

    Depositor Address is: addr_test1vpsayukzp4exf33vx2c6sk7eduhhg57meqajme5ylf6flvgmgskv7

Deposit 100 tADA

    Deposit Datum is: d8799f581c61d272c20d7264c62c32b1a85bd96f2f7453dbc83b2de684fa749fb1ff


    Deposit Tx Hash is: 360ddd63152f8a82c707999bbcabf42559eed8b500559ba4c26abeb944041948

Waiting for deposit tx to be on chain...
```

### *Run fake withdraw test case which will fail*

First copy the `deposit tx hash` from `deposit test case` output.

And run following command

```bash
deno task test:withdraw_fake -- ${Deposit Tx Hash}
```

### *Run true withdraw test case which will succeed*

First copy the `deposit tx hash` from `deposit test case` output.

And run following command

```bash
deno task test:withdraw -- ${Deposit Tx Hash}
```
