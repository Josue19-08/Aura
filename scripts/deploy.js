const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Aura deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy ProductRegistry
  console.log("📦 Deploying ProductRegistry...");
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  const registry = await ProductRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  console.log("✅ ProductRegistry deployed to:", registryAddress);
  console.log("   Transaction hash:", registry.deploymentTransaction().hash);

  // Grant MANUFACTURER_ROLE to deployer for testing
  console.log("\n🔑 Granting MANUFACTURER_ROLE to deployer...");
  const MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
  const grantTx = await registry.grantRole(MANUFACTURER_ROLE, deployer.address);
  await grantTx.wait();
  console.log("✅ MANUFACTURER_ROLE granted");

  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("Network:", hre.network.name);
  console.log("ProductRegistry:", registryAddress);
  console.log("Deployer:", deployer.address);
  console.log("========================\n");

  console.log("⚠️  Important: Save these addresses for backend and frontend configuration!\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contracts: {
      ProductRegistry: registryAddress
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const fs = require("fs");
  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  const deploymentPath = `${deploymentsDir}/${hre.network.name}.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentPath);

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n📝 To verify on Snowtrace:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${registryAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
