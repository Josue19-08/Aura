const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const targetAddress = process.argv[2];

  if (!contractAddress) {
    console.error("❌ CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }

  if (!targetAddress) {
    console.error("❌ Usage: npx hardhat run scripts/grantRole.js --network fuji <ADDRESS>");
    process.exit(1);
  }

  console.log("🔑 Granting roles...\n");
  console.log("Contract:", contractAddress);
  console.log("Target address:", targetAddress);

  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  const registry = ProductRegistry.attach(contractAddress);

  const MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
  const DISTRIBUTOR_ROLE = await registry.DISTRIBUTOR_ROLE();

  console.log("\n1️⃣ Granting MANUFACTURER_ROLE...");
  const tx1 = await registry.grantRole(MANUFACTURER_ROLE, targetAddress);
  await tx1.wait();
  console.log("✅ MANUFACTURER_ROLE granted");

  console.log("\n2️⃣ Granting DISTRIBUTOR_ROLE...");
  const tx2 = await registry.grantRole(DISTRIBUTOR_ROLE, targetAddress);
  await tx2.wait();
  console.log("✅ DISTRIBUTOR_ROLE granted");

  console.log("\n✅ All roles granted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
