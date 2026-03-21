// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IProductRegistry
 * @notice Interface for ProductRegistry contract
 */
interface IProductRegistry {
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

    struct CustodyRecord {
        address custodian;
        uint256 timestamp;
        string locationNote;
    }

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

    function registerProduct(
        string memory lotId,
        string memory productName,
        string memory origin,
        string memory ipfsHash
    ) external returns (uint256 productId);

    function transferCustody(
        uint256 productId,
        address newCustodian,
        string memory locationNote
    ) external;

    function verifyProduct(uint256 productId)
        external
        returns (
            bool exists,
            Product memory product,
            CustodyRecord[] memory history,
            address custodian
        );

    function getProduct(uint256 productId) external view returns (Product memory);
    
    function getCustodyHistory(uint256 productId) external view returns (CustodyRecord[] memory);
    
    function getCurrentCustodian(uint256 productId) external view returns (address);
    
    function getTotalProducts() external view returns (uint256);
}
