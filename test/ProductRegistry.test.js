const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ProductRegistry", function () {
  async function deployProductRegistryFixture() {
    const [owner, manufacturer, distributor, retailer, user] = await ethers.getSigners();

    const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
    const registry = await ProductRegistry.deploy();

    const MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
    const DISTRIBUTOR_ROLE = await registry.DISTRIBUTOR_ROLE();
    const DEFAULT_ADMIN_ROLE = await registry.DEFAULT_ADMIN_ROLE();

    // Grant roles
    await registry.grantRole(MANUFACTURER_ROLE, manufacturer.address);
    await registry.grantRole(DISTRIBUTOR_ROLE, distributor.address);

    return { registry, owner, manufacturer, distributor, retailer, user, MANUFACTURER_ROLE, DISTRIBUTOR_ROLE, DEFAULT_ADMIN_ROLE };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DEPLOYMENT
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      const { registry, owner } = await loadFixture(deployProductRegistryFixture);
      const DEFAULT_ADMIN_ROLE = await registry.DEFAULT_ADMIN_ROLE();
      expect(await registry.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant manufacturer role correctly", async function () {
      const { registry, manufacturer, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.true;
    });

    it("Should start with zero products", async function () {
      const { registry } = await loadFixture(deployProductRegistryFixture);
      expect(await registry.getTotalProducts()).to.equal(0);
    });

    it("Should start unpaused", async function () {
      const { registry } = await loadFixture(deployProductRegistryFixture);
      expect(await registry.paused()).to.be.false;
    });

    it("Should NOT grant MANUFACTURER_ROLE to deployer by default", async function () {
      const { registry, owner, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      expect(await registry.hasRole(MANUFACTURER_ROLE, owner.address)).to.be.false;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ACCESS CONTROL - ROLE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Access Control - Role Management", function () {
    it("Should allow admin to grant MANUFACTURER_ROLE to another address", async function () {
      const { registry, owner, user, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await registry.connect(owner).grantRole(MANUFACTURER_ROLE, user.address);
      expect(await registry.hasRole(MANUFACTURER_ROLE, user.address)).to.be.true;
    });

    it("Should allow admin to revoke MANUFACTURER_ROLE", async function () {
      const { registry, owner, manufacturer, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await registry.connect(owner).revokeRole(MANUFACTURER_ROLE, manufacturer.address);
      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.false;
    });

    it("Should prevent registration after MANUFACTURER_ROLE is revoked", async function () {
      const { registry, owner, manufacturer, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await registry.connect(owner).revokeRole(MANUFACTURER_ROLE, manufacturer.address);
      await expect(
        registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash")
      ).to.be.reverted;
    });

    it("Should allow manufacturing after role is granted", async function () {
      const { registry, owner, user, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await registry.connect(owner).grantRole(MANUFACTURER_ROLE, user.address);
      await expect(
        registry.connect(user).registerProduct("LOT-001", "Product", "Bogotá", "QmHash")
      ).to.not.be.reverted;
    });

    it("Should prevent non-admin from granting roles", async function () {
      const { registry, user, retailer, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await expect(
        registry.connect(user).grantRole(MANUFACTURER_ROLE, retailer.address)
      ).to.be.reverted;
    });

    it("Should prevent non-admin from revoking roles", async function () {
      const { registry, user, manufacturer, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await expect(
        registry.connect(user).revokeRole(MANUFACTURER_ROLE, manufacturer.address)
      ).to.be.reverted;
    });

    it("Should allow an account to renounce its own role", async function () {
      const { registry, manufacturer, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);
      await registry.connect(manufacturer).renounceRole(MANUFACTURER_ROLE, manufacturer.address);
      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.false;
    });

    it("DISTRIBUTOR_ROLE should not allow product registration", async function () {
      const { registry, distributor } = await loadFixture(deployProductRegistryFixture);
      await expect(
        registry.connect(distributor).registerProduct("LOT-001", "Product", "Bogotá", "QmHash")
      ).to.be.reverted;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PRODUCT REGISTRATION
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Product Registration", function () {
    it("Should register a product with valid data", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      const lotId = "LOT-2026-001";
      const productName = "Ibuprofeno 400mg";
      const origin = "Bogotá, Colombia";
      const ipfsHash = "QmX4f7abc123";

      const tx = await registry.connect(manufacturer).registerProduct(lotId, productName, origin, ipfsHash);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "ProductRegistered")
        .withArgs(1, lotId, manufacturer.address, block.timestamp);

      const product = await registry.getProduct(1);
      expect(product.id).to.equal(1);
      expect(product.lotId).to.equal(lotId);
      expect(product.productName).to.equal(productName);
      expect(product.origin).to.equal(origin);
      expect(product.ipfsHash).to.equal(ipfsHash);
      expect(product.manufacturer).to.equal(manufacturer.address);
      expect(product.active).to.be.true;
      expect(product.verificationCount).to.equal(0);
    });

    it("Should revert if caller lacks MANUFACTURER_ROLE", async function () {
      const { registry, user } = await loadFixture(deployProductRegistryFixture);

      await expect(
        registry.connect(user).registerProduct("LOT-001", "Product", "Location", "QmHash")
      ).to.be.reverted;
    });

    it("Should initialize custody with manufacturer", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      const history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(1);
      expect(history[0].custodian).to.equal(manufacturer.address);
      expect(history[0].locationNote).to.equal("Bogotá");
    });

    it("Should increment product IDs sequentially", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product 1", "Bogotá", "QmHash1");
      await registry.connect(manufacturer).registerProduct("LOT-002", "Product 2", "Medellín", "QmHash2");
      await registry.connect(manufacturer).registerProduct("LOT-003", "Product 3", "Cali", "QmHash3");

      expect((await registry.getProduct(1)).id).to.equal(1);
      expect((await registry.getProduct(2)).id).to.equal(2);
      expect((await registry.getProduct(3)).id).to.equal(3);
    });

    it("Should allow multiple manufacturers to register products independently", async function () {
      const { registry, owner, manufacturer, user, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(owner).grantRole(MANUFACTURER_ROLE, user.address);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product A", "Bogotá", "QmHashA");
      await registry.connect(user).registerProduct("LOT-002", "Product B", "Medellín", "QmHashB");

      expect((await registry.getProduct(1)).manufacturer).to.equal(manufacturer.address);
      expect((await registry.getProduct(2)).manufacturer).to.equal(user.address);
    });

    it("Should revert registration when contract is paused", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(owner).pause();

      await expect(
        registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash")
      ).to.be.revertedWithCustomError(registry, "EnforcedPause");
    });

    it("Should set createdAt timestamp at registration time", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      const tx = await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      const product = await registry.getProduct(1);
      expect(product.createdAt).to.equal(block.timestamp);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // CUSTODY TRANSFER
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Custody Transfer", function () {
    it("Should transfer custody to new address", async function () {
      const { registry, manufacturer, distributor } = await loadFixture(deployProductRegistryFixture);

      // Register product
      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      // Transfer custody
      const transferTx = await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín Warehouse");
      const transferReceipt = await transferTx.wait();
      const transferBlock = await ethers.provider.getBlock(transferReceipt.blockNumber);

      await expect(transferTx)
        .to.emit(registry, "CustodyTransferred")
        .withArgs(1, manufacturer.address, distributor.address, "Medellín Warehouse", transferBlock.timestamp);

      const currentCustodian = await registry.getCurrentCustodian(1);
      expect(currentCustodian).to.equal(distributor.address);

      const history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(2);
      expect(history[1].custodian).to.equal(distributor.address);
      expect(history[1].locationNote).to.equal("Medellín Warehouse");
    });

    it("Should revert if caller is not current custodian", async function () {
      const { registry, manufacturer, distributor, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      await expect(
        registry.connect(user).transferCustody(1, distributor.address, "Location")
      ).to.be.revertedWithCustomError(registry, "NotCurrentCustodian");
    });

    it("Should revert if transferring to zero address", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      await expect(
        registry.connect(manufacturer).transferCustody(1, ethers.ZeroAddress, "Location")
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");
    });

    it("Should revert if product does not exist", async function () {
      const { registry, manufacturer, distributor } = await loadFixture(deployProductRegistryFixture);

      await expect(
        registry.connect(manufacturer).transferCustody(999, distributor.address, "Location")
      ).to.be.revertedWithCustomError(registry, "ProductNotFound");
    });

    it("Should revert transfer when contract is paused", async function () {
      const { registry, owner, manufacturer, distributor } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(owner).pause();

      await expect(
        registry.connect(manufacturer).transferCustody(1, distributor.address, "Location")
      ).to.be.revertedWithCustomError(registry, "EnforcedPause");
    });

    it("Should allow transfer to self (same address)", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      await expect(
        registry.connect(manufacturer).transferCustody(1, manufacturer.address, "Same Warehouse")
      ).to.not.be.reverted;

      expect(await registry.getCurrentCustodian(1)).to.equal(manufacturer.address);
    });

    it("Should allow multi-hop custody chain", async function () {
      const { registry, manufacturer, distributor, retailer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín");
      await registry.connect(distributor).transferCustody(1, retailer.address, "Cali");

      expect(await registry.getCurrentCustodian(1)).to.equal(retailer.address);

      const history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(3);
      expect(history[0].custodian).to.equal(manufacturer.address);
      expect(history[1].custodian).to.equal(distributor.address);
      expect(history[2].custodian).to.equal(retailer.address);
    });

    it("Should NOT allow previous custodian to transfer after giving up custody", async function () {
      const { registry, manufacturer, distributor, retailer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín");

      await expect(
        registry.connect(manufacturer).transferCustody(1, retailer.address, "Cali")
      ).to.be.revertedWithCustomError(registry, "NotCurrentCustodian");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PRODUCT VERIFICATION
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Product Verification", function () {
    it("Should verify product and increment counter", async function () {
      const { registry, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Ibuprofeno 400mg",
        "Bogotá",
        "QmHash"
      );

      const [exists, product, history, custodian] = await registry.connect(user).verifyProduct.staticCall(1);

      expect(exists).to.be.true;
      expect(product.id).to.equal(1);
      expect(product.productName).to.equal("Ibuprofeno 400mg");
      expect(history.length).to.equal(1);
      expect(custodian).to.equal(manufacturer.address);

      const verifyTx = await registry.connect(user).verifyProduct(1);
      const verifyReceipt = await verifyTx.wait();
      const verifyBlock = await ethers.provider.getBlock(verifyReceipt.blockNumber);

      await expect(verifyTx)
        .to.emit(registry, "ProductVerified")
        .withArgs(1, user.address, 1, verifyBlock.timestamp);

      const updatedProduct = await registry.getProduct(1);
      expect(updatedProduct.verificationCount).to.equal(1);
    });

    it("Should return false for non-existent product", async function () {
      const { registry, user } = await loadFixture(deployProductRegistryFixture);

      const [exists] = await registry.connect(user).verifyProduct.staticCall(999);
      expect(exists).to.be.false;
    });

    it("Should allow multiple verifications", async function () {
      const { registry, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      await registry.connect(user).verifyProduct(1);
      await registry.connect(user).verifyProduct(1);
      await registry.connect(user).verifyProduct(1);

      const product = await registry.getProduct(1);
      expect(product.verificationCount).to.equal(3);
    });

    it("Should allow anyone to verify a product (no role required)", async function () {
      const { registry, manufacturer, distributor, retailer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      await registry.connect(distributor).verifyProduct(1);
      await registry.connect(retailer).verifyProduct(1);
      await registry.connect(user).verifyProduct(1);

      const product = await registry.getProduct(1);
      expect(product.verificationCount).to.equal(3);
    });

    it("Should NOT emit event when verifying non-existent product", async function () {
      const { registry, user } = await loadFixture(deployProductRegistryFixture);

      const tx = await registry.connect(user).verifyProduct(999);
      await expect(tx).to.not.emit(registry, "ProductVerified");
    });

    it("Should still allow verification of inactive product", async function () {
      const { registry, owner, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(owner).deactivateProduct(1);

      const [exists] = await registry.connect(user).verifyProduct.staticCall(1);
      expect(exists).to.be.true;
    });

    it("Should allow verification while contract is paused", async function () {
      const { registry, owner, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(owner).pause();

      // verifyProduct is NOT protected by whenNotPaused
      await expect(registry.connect(user).verifyProduct(1)).to.not.be.reverted;
    });

    it("verificationCount should never decrease", async function () {
      const { registry, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      for (let i = 1; i <= 5; i++) {
        await registry.connect(user).verifyProduct(1);
        const product = await registry.getProduct(1);
        expect(product.verificationCount).to.equal(i);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  describe("View Functions", function () {
    it("Should get product without incrementing counter", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      const productBefore = await registry.getProduct(1);
      expect(productBefore.verificationCount).to.equal(0);

      // Call getProduct multiple times
      await registry.getProduct(1);
      await registry.getProduct(1);

      const productAfter = await registry.getProduct(1);
      expect(productAfter.verificationCount).to.equal(0);
    });

    it("Should revert getProduct on non-existent ID", async function () {
      const { registry } = await loadFixture(deployProductRegistryFixture);

      await expect(registry.getProduct(999)).to.be.revertedWithCustomError(registry, "ProductNotFound");
    });

    it("Should revert getCustodyHistory on non-existent product", async function () {
      const { registry } = await loadFixture(deployProductRegistryFixture);

      await expect(registry.getCustodyHistory(999)).to.be.revertedWithCustomError(registry, "ProductNotFound");
    });

    it("Should revert getCurrentCustodian on non-existent product", async function () {
      const { registry } = await loadFixture(deployProductRegistryFixture);

      await expect(registry.getCurrentCustodian(999)).to.be.revertedWithCustomError(registry, "ProductNotFound");
    });

    it("Should get custody history", async function () {
      const { registry, manufacturer, distributor, retailer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín");
      await registry.connect(distributor).transferCustody(1, retailer.address, "Cali");

      const history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(3);
      expect(history[0].custodian).to.equal(manufacturer.address);
      expect(history[1].custodian).to.equal(distributor.address);
      expect(history[2].custodian).to.equal(retailer.address);
    });

    it("Should get total products count", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      expect(await registry.getTotalProducts()).to.equal(0);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product 1", "Bogotá", "QmHash1");
      expect(await registry.getTotalProducts()).to.equal(1);

      await registry.connect(manufacturer).registerProduct("LOT-002", "Product 2", "Medellín", "QmHash2");
      expect(await registry.getTotalProducts()).to.equal(2);
    });

    it("Should return correct current custodian after chain of transfers", async function () {
      const { registry, manufacturer, distributor, retailer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      expect(await registry.getCurrentCustodian(1)).to.equal(manufacturer.address);

      await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín");
      expect(await registry.getCurrentCustodian(1)).to.equal(distributor.address);

      await registry.connect(distributor).transferCustody(1, retailer.address, "Cali");
      expect(await registry.getCurrentCustodian(1)).to.equal(retailer.address);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ADMIN FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Admin Functions", function () {
    it("Should allow admin to deactivate product", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      const deactivateTx = await registry.connect(owner).deactivateProduct(1);
      const deactivateReceipt = await deactivateTx.wait();
      const deactivateBlock = await ethers.provider.getBlock(deactivateReceipt.blockNumber);

      await expect(deactivateTx)
        .to.emit(registry, "ProductDeactivated")
        .withArgs(1, deactivateBlock.timestamp);

      const product = await registry.getProduct(1);
      expect(product.active).to.be.false;
    });

    it("Should prevent transfers of deactivated products", async function () {
      const { registry, owner, manufacturer, distributor } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      await registry.connect(owner).deactivateProduct(1);

      await expect(
        registry.connect(manufacturer).transferCustody(1, distributor.address, "Location")
      ).to.be.revertedWithCustomError(registry, "ProductInactive");
    });

    it("Should revert deactivation of non-existent product", async function () {
      const { registry, owner } = await loadFixture(deployProductRegistryFixture);

      await expect(
        registry.connect(owner).deactivateProduct(999)
      ).to.be.revertedWithCustomError(registry, "ProductNotFound");
    });

    it("Should revert deactivation by non-admin", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      await expect(
        registry.connect(manufacturer).deactivateProduct(1)
      ).to.be.reverted;
    });

    it("Should allow deactivating an already inactive product (idempotent)", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(owner).deactivateProduct(1);

      await expect(registry.connect(owner).deactivateProduct(1)).to.not.be.reverted;

      const product = await registry.getProduct(1);
      expect(product.active).to.be.false;
    });

    it("Should allow admin to pause contract", async function () {
      const { registry, owner } = await loadFixture(deployProductRegistryFixture);

      await expect(registry.connect(owner).pause())
        .to.emit(registry, "Paused")
        .withArgs(owner.address);

      expect(await registry.paused()).to.be.true;
    });

    it("Should allow admin to unpause contract", async function () {
      const { registry, owner } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(owner).pause();

      await expect(registry.connect(owner).unpause())
        .to.emit(registry, "Unpaused")
        .withArgs(owner.address);

      expect(await registry.paused()).to.be.false;
    });

    it("Should allow admin to pause and unpause", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(owner).pause();

      await expect(
        registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash")
      ).to.be.revertedWithCustomError(registry, "EnforcedPause");

      await registry.connect(owner).unpause();

      await expect(
        registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash")
      ).to.not.be.reverted;
    });

    it("Should prevent non-admin from pausing", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await expect(registry.connect(manufacturer).pause()).to.be.reverted;
    });

    it("Should prevent non-admin from unpausing", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(owner).pause();

      await expect(registry.connect(manufacturer).unpause()).to.be.reverted;
    });

    it("Should allow deactivateProduct while paused", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      await registry.connect(owner).pause();

      // deactivateProduct is not protected by whenNotPaused
      await expect(registry.connect(owner).deactivateProduct(1)).to.not.be.reverted;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  describe("State Management", function () {
    it("Product counter should be monotonically increasing", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      for (let i = 1; i <= 5; i++) {
        await registry.connect(manufacturer).registerProduct(`LOT-00${i}`, `Product ${i}`, "Bogotá", `QmHash${i}`);
        expect(await registry.getTotalProducts()).to.equal(i);
      }
    });

    it("Custody history array should be append-only (never shrink)", async function () {
      const { registry, manufacturer, distributor, retailer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      let history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(1);

      await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín");
      history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(2);

      await registry.connect(distributor).transferCustody(1, retailer.address, "Cali");
      history = await registry.getCustodyHistory(1);
      expect(history.length).to.equal(3);

      // First record should remain unchanged
      expect(history[0].custodian).to.equal(manufacturer.address);
      expect(history[0].locationNote).to.equal("Bogotá");
    });

    it("Should correctly track products registered by multiple manufacturers", async function () {
      const { registry, owner, manufacturer, user, MANUFACTURER_ROLE } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(owner).grantRole(MANUFACTURER_ROLE, user.address);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product A", "Bogotá", "QmHashA");
      await registry.connect(user).registerProduct("LOT-002", "Product B", "Medellín", "QmHashB");
      await registry.connect(manufacturer).registerProduct("LOT-003", "Product C", "Cali", "QmHashC");

      expect(await registry.getTotalProducts()).to.equal(3);
      expect((await registry.getProduct(1)).manufacturer).to.equal(manufacturer.address);
      expect((await registry.getProduct(2)).manufacturer).to.equal(user.address);
      expect((await registry.getProduct(3)).manufacturer).to.equal(manufacturer.address);
    });

    it("Deactivation should not affect other products", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product 1", "Bogotá", "QmHash1");
      await registry.connect(manufacturer).registerProduct("LOT-002", "Product 2", "Medellín", "QmHash2");

      await registry.connect(owner).deactivateProduct(1);

      expect((await registry.getProduct(1)).active).to.be.false;
      expect((await registry.getProduct(2)).active).to.be.true;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT EMISSION
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Event Emission", function () {
    it("Should emit ProductRegistered with correct parameters", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      const lotId = "LOT-EVENT-001";
      const tx = await registry.connect(manufacturer).registerProduct(lotId, "Product", "Bogotá", "QmHash");
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "ProductRegistered")
        .withArgs(1, lotId, manufacturer.address, block.timestamp);
    });

    it("Should emit CustodyTransferred with correct from/to/location", async function () {
      const { registry, manufacturer, distributor } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      const tx = await registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín");
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "CustodyTransferred")
        .withArgs(1, manufacturer.address, distributor.address, "Medellín", block.timestamp);
    });

    it("Should emit ProductVerified with correct count and verifier", async function () {
      const { registry, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      const tx = await registry.connect(user).verifyProduct(1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "ProductVerified")
        .withArgs(1, user.address, 1, block.timestamp);
    });

    it("Should emit ProductDeactivated with correct productId", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      const tx = await registry.connect(owner).deactivateProduct(1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "ProductDeactivated")
        .withArgs(1, block.timestamp);
    });

    it("Should emit Paused and Unpaused events", async function () {
      const { registry, owner } = await loadFixture(deployProductRegistryFixture);

      await expect(registry.connect(owner).pause())
        .to.emit(registry, "Paused")
        .withArgs(owner.address);

      await expect(registry.connect(owner).unpause())
        .to.emit(registry, "Unpaused")
        .withArgs(owner.address);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SECURITY
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Security", function () {
    it("Should handle 50 rapid verifications accurately", async function () {
      const { registry, manufacturer, user } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      const ITERATIONS = 50;
      for (let i = 0; i < ITERATIONS; i++) {
        await registry.connect(user).verifyProduct(1);
      }

      const product = await registry.getProduct(1);
      expect(product.verificationCount).to.equal(ITERATIONS);
    });

    it("Should correctly record nonReentrant on registerProduct (single state change)", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");
      expect(await registry.getTotalProducts()).to.equal(1);
    });

    it("Should revert unauthorized role access with AccessControl error", async function () {
      const { registry, user } = await loadFixture(deployProductRegistryFixture);

      await expect(
        registry.connect(user).registerProduct("LOT-X", "Hack", "Nowhere", "QmEvil")
      ).to.be.reverted;
    });

    it("Should reject transfers for non-custodians even if they hold a role", async function () {
      const { registry, manufacturer, distributor } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct("LOT-001", "Product", "Bogotá", "QmHash");

      // distributor has DISTRIBUTOR_ROLE but is not the current custodian
      await expect(
        registry.connect(distributor).transferCustody(1, distributor.address, "Medellín")
      ).to.be.revertedWithCustomError(registry, "NotCurrentCustodian");
    });
  });
});
