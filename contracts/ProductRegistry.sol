// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ProductRegistry
 * @notice Main contract for Aura - immutable product traceability system
 * @dev Manages product registration, custody transfers, and verification
 */
contract ProductRegistry is AccessControl, ReentrancyGuard, Pausable {
    // Roles
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    // Product structure
    struct Product {
        uint256 id;
        string lotId;
        string productName;
        string origin;
        string ipfsHash;
        address manufacturer;
        uint256 createdAt;
        uint256 verificationCount;
        bool active;
    }

    // Custody record structure
    struct CustodyRecord {
        address custodian;
        uint256 timestamp;
        string locationNote;
    }

    // Storage
    mapping(uint256 => Product) public products;
    mapping(uint256 => CustodyRecord[]) public custodyHistory;
    mapping(uint256 => address) public currentCustodian;
    
    uint256 private _productIdCounter;

    // Events
    event ProductRegistered(
        uint256 indexed productId,
        string lotId,
        address indexed manufacturer,
        uint256 timestamp
    );

    event CustodyTransferred(
        uint256 indexed productId,
        address indexed fromCustodian,
        address indexed toCustodian,
        string location,
        uint256 timestamp
    );

    event ProductVerified(
        uint256 indexed productId,
        address verifier,
        uint256 newCount,
        uint256 timestamp
    );

    event ProductDeactivated(
        uint256 indexed productId,
        uint256 timestamp
    );

    // Custom errors
    error ProductNotFound(uint256 productId);
    error NotCurrentCustodian(address caller, address currentCustodian);
    error InvalidAddress();
    error ProductInactive(uint256 productId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Register a new product on-chain
     * @param lotId Manufacturing batch identifier
     * @param productName Product name/description
     * @param origin Manufacturing location
     * @param ipfsHash IPFS content hash for extended metadata
     * @return productId Unique product identifier
     */
    function registerProduct(
        string memory lotId,
        string memory productName,
        string memory origin,
        string memory ipfsHash
    ) 
        external 
        onlyRole(MANUFACTURER_ROLE) 
        whenNotPaused 
        nonReentrant 
        returns (uint256 productId) 
    {
        productId = ++_productIdCounter;

        products[productId] = Product({
            id: productId,
            lotId: lotId,
            productName: productName,
            origin: origin,
            ipfsHash: ipfsHash,
            manufacturer: msg.sender,
            createdAt: block.timestamp,
            verificationCount: 0,
            active: true
        });

        // Initialize custody with manufacturer
        custodyHistory[productId].push(CustodyRecord({
            custodian: msg.sender,
            timestamp: block.timestamp,
            locationNote: origin
        }));

        currentCustodian[productId] = msg.sender;

        emit ProductRegistered(productId, lotId, msg.sender, block.timestamp);
    }

    /**
     * @notice Transfer product custody to new address
     * @param productId Product to transfer
     * @param newCustodian Recipient wallet address
     * @param locationNote Location description
     */
    function transferCustody(
        uint256 productId,
        address newCustodian,
        string memory locationNote
    ) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (products[productId].id == 0) revert ProductNotFound(productId);
        if (!products[productId].active) revert ProductInactive(productId);
        if (newCustodian == address(0)) revert InvalidAddress();
        if (currentCustodian[productId] != msg.sender) {
            revert NotCurrentCustodian(msg.sender, currentCustodian[productId]);
        }

        address previousCustodian = currentCustodian[productId];
        currentCustodian[productId] = newCustodian;

        custodyHistory[productId].push(CustodyRecord({
            custodian: newCustodian,
            timestamp: block.timestamp,
            locationNote: locationNote
        }));

        emit CustodyTransferred(
            productId,
            previousCustodian,
            newCustodian,
            locationNote,
            block.timestamp
        );
    }

    /**
     * @notice Verify product authenticity and get complete history
     * @param productId Product to verify
     * @return exists Whether product is registered
     * @return product Product data
     * @return history Complete custody chain
     * @return custodian Current holder address
     */
    function verifyProduct(uint256 productId)
        external
        returns (
            bool exists,
            Product memory product,
            CustodyRecord[] memory history,
            address custodian
        )
    {
        exists = products[productId].id != 0;
        
        if (exists) {
            product = products[productId];
            history = custodyHistory[productId];
            custodian = currentCustodian[productId];

            // Increment verification counter
            products[productId].verificationCount++;

            emit ProductVerified(
                productId,
                msg.sender,
                products[productId].verificationCount,
                block.timestamp
            );
        }
    }

    /**
     * @notice Get product data without incrementing counter (view only)
     * @param productId Product to query
     * @return Product data
     */
    function getProduct(uint256 productId) 
        external 
        view 
        returns (Product memory) 
    {
        if (products[productId].id == 0) revert ProductNotFound(productId);
        return products[productId];
    }

    /**
     * @notice Get complete custody history for a product
     * @param productId Product to query
     * @return Custody chain
     */
    function getCustodyHistory(uint256 productId)
        external
        view
        returns (CustodyRecord[] memory)
    {
        if (products[productId].id == 0) revert ProductNotFound(productId);
        return custodyHistory[productId];
    }

    /**
     * @notice Get current custodian of a product
     * @param productId Product to query
     * @return Current custodian address
     */
    function getCurrentCustodian(uint256 productId)
        external
        view
        returns (address)
    {
        if (products[productId].id == 0) revert ProductNotFound(productId);
        return currentCustodian[productId];
    }

    /**
     * @notice Deactivate a product (emergency use only)
     * @param productId Product to deactivate
     */
    function deactivateProduct(uint256 productId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (products[productId].id == 0) revert ProductNotFound(productId);
        products[productId].active = false;
        emit ProductDeactivated(productId, block.timestamp);
    }

    /**
     * @notice Get total number of registered products
     * @return Total product count
     */
    function getTotalProducts() external view returns (uint256) {
        return _productIdCounter;
    }

    /**
     * @notice Pause all contract operations (emergency only)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract operations
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
