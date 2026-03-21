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

    // Grant roles
    await registry.grantRole(MANUFACTURER_ROLE, manufacturer.address);
    await registry.grantRole(DISTRIBUTOR_ROLE, distributor.address);

    return { registry, owner, manufacturer, distributor, retailer, user, MANUFACTURER_ROLE, DISTRIBUTOR_ROLE };
  }

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
  });

  describe("Product Registration", function () {
    it("Should register a product with valid data", async function () {
      const { registry, manufacturer } = await loadFixture(deployProductRegistryFixture);

      const lotId = "LOT-2026-001";
      const productName = "Ibuprofeno 400mg";
      const origin = "Bogotá, Colombia";
      const ipfsHash = "QmX4f7abc123";

      await expect(
        registry.connect(manufacturer).registerProduct(lotId, productName, origin, ipfsHash)
      )
        .to.emit(registry, "ProductRegistered")
        .withArgs(1, lotId, manufacturer.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

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
  });

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
      await expect(
        registry.connect(manufacturer).transferCustody(1, distributor.address, "Medellín Warehouse")
      )
        .to.emit(registry, "CustodyTransferred")
        .withArgs(1, manufacturer.address, distributor.address, "Medellín Warehouse", await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

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
  });

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

      await expect(registry.connect(user).verifyProduct(1))
        .to.emit(registry, "ProductVerified")
        .withArgs(1, user.address, 1, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

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
  });

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
  });

  describe("Admin Functions", function () {
    it("Should allow admin to deactivate product", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployProductRegistryFixture);

      await registry.connect(manufacturer).registerProduct(
        "LOT-001",
        "Product",
        "Bogotá",
        "QmHash"
      );

      await expect(registry.connect(owner).deactivateProduct(1))
        .to.emit(registry, "ProductDeactivated")
        .withArgs(1, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

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
  });
});
