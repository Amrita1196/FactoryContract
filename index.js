const { AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
  ContractCreateFlow, } = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require("fs");

// Hedera Testnet account details
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

if (operatorPrivateKey == null || operatorId == null) {
  throw new Error("Env variables cannot be null");
}
console.log("ID and keys are fine");

// Create a new Hedera client
const client = Client.forTestnet().setOperator(operatorId, operatorPrivateKey);

async function deployFactoryContract() {


  // Read the bytecode of the factory contract
  const factoryBytecode = fs.readFileSync("FactoryContract_sol_FactoryContract.bin");
  console.log("bytecode is fine");

  console.info("========== Deploying a Hedera Smart Contract ===========");
  // Create a new contract instance
  const contractInstantiateTx = await new ContractCreateFlow()
    .setBytecode(factoryBytecode)
    .setGas(300000);

  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  console.log("ContractCreateTransaction is fine");
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
  console.log("getReceipt is fine");
  const contractId = contractInstantiateRx.contractId;
  console.log("contract id is fine");
  const contractAddress = contractId.toSolidityAddress();
  console.log("hi");
  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

  console.info("========== Calling Smart Contract createContract Function ===========");
  // constructor call
  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(300000)
    .setFunction(
      "createContract",
      new ContractFunctionParameters().addUint256(22)
    );
  const contractExecuteSubmit = await contractExecuteTx.execute(client);
  const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
  console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);


  console.info("========== Calling Smart Contract getDeployedContracts Function ===========");
  const contractQueryTx1 = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("getDeployedContracts", new ContractFunctionParameters());
  const contractQuerySubmit1 = await contractQueryTx1.execute(client);
  const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
  const conversion = contractQueryResult1.toSolidityAddress;
  console.log(`- Here's the address of the deployed contract ${contractQueryResult1} \n`);

  

  // // Deploy the Child Contract
  // console.info("========== Deploying Child Contract ===========");
  // // Import the bytecode and ABI of the child contract
  // const childByteCode = fs.readFileSync("ChildContract_sol_ChildContract.bin");
  // // const childAbi = JSON.parse(fs.readFileSync("ChildContract_sol_ChildContract.json"));

  // // Create a new ContractCreateTransaction for the Child Contract
  // const childInstantiateTx = new ContractCreateTransaction()
  //   .setBytecode(childByteCode)
  //   .setGas(100000)
  //   .setConstructorParams([ContractFunctionParameters.fromUint256(0)]);
  // const childInstantiateSubmit = await childInstantiateTx.execute(client);
  // const childInstantiateRx = await childInstantiateSubmit.getReceipt(client);
  // const childContractId = childInstantiateRx.contractId;
  // const childContractAddress = childContractId.toString();
  // console.log(`- Child Contract deployed with ID: ${childContractId}`);

  // // Call the createContract function of the Factory Contract to link it with the Child Contract
  // console.info("========== Calling Factory Contract createContract Function ===========");
  // const factoryContractExecuteTx = new ContractExecuteTransaction()
  //   .setContractId(factoryContractId)
  //   .setGas(100000)
  //   .setFunction("createContract", [ContractFunctionParameters.fromUint256(0)]);
  // const factoryContractExecuteSubmit = await factoryContractExecuteTx.execute(client);
  // const factoryContractExecuteRx = await factoryContractExecuteSubmit.getReceipt(client);
  // console.log("- Factory Contract createContract function executed successfully");

  // Get the deployed Child Contracts from the Factory Contract
  // console.info("========== Calling Factory Contract getDeployedContracts Function ===========");
  // const factoryContractCallQuery = new ContractCallQuery()
  //   .setContractId(factoryContractId)
  //   .setGas(100000)
  //   .setFunction("getDeployedContracts");
  // const factoryContractCallSubmit = await factoryContractCallQuery.execute(client);
  // const deployedContracts = factoryContractCallSubmit.get<ChildContract[]>(0);
  // console.log("- Deployed Child Contracts:");
  // deployedContracts.forEach((contract) => {
  //   console.log(contract.toString());
  // });
}

deployFactoryContract().catch(console.error);
