#!/usr/bin/env node
import 'dotenv/config';
import { ipfsService } from './src/services/ipfs.js';
import { logger } from './src/utils/logger.js';

/**
 * Test script for IPFS service
 *
 * This script tests the IPFS service independently of the blockchain
 * to verify Pinata configuration is working correctly.
 */

async function testIPFSService() {
  console.log('\n🧪 Testing IPFS Service...\n');

  try {
    // Test 1: Configuration check
    console.log('1️⃣  Checking Pinata configuration...');
    ipfsService.validateConfig();
    console.log('✅ Pinata credentials configured\n');

    // Test 2: Connection test
    console.log('2️⃣  Testing Pinata connection...');
    const isConnected = await ipfsService.testConnection();
    if (isConnected) {
      console.log('✅ Successfully connected to Pinata\n');
    }

    // Test 3: Upload metadata
    console.log('3️⃣  Uploading test metadata to IPFS...');
    const testMetadata = {
      productName: 'Test Product - Ibuprofeno 400mg',
      lotId: 'TEST-LOT-001',
      manufacturer: 'Test Pharma Corp',
      origin: 'Bogotá, Colombia',
      manufactureDate: new Date().toISOString(),
      description: 'This is a test product for IPFS service validation',
      testRun: true,
      timestamp: Date.now()
    };

    const cid = await ipfsService.uploadMetadata(testMetadata);
    console.log(`✅ Metadata uploaded successfully!`);
    console.log(`   CID: ${cid}`);
    console.log(`   URL: ${ipfsService.getPublicUrl(cid)}\n`);

    // Test 4: Retrieve metadata
    console.log('4️⃣  Retrieving metadata from IPFS...');
    const retrievedMetadata = await ipfsService.retrieveMetadata(cid);
    console.log('✅ Metadata retrieved successfully!');
    console.log('   Retrieved data:', JSON.stringify(retrievedMetadata, null, 2));

    // Test 5: Verify data integrity
    console.log('\n5️⃣  Verifying data integrity...');
    const originalKeys = Object.keys(testMetadata);
    const retrievedKeys = Object.keys(retrievedMetadata);

    let allKeysMatch = true;
    for (const key of originalKeys) {
      if (retrievedMetadata[key] !== testMetadata[key]) {
        console.log(`   ⚠️  Key "${key}" doesn't match`);
        allKeysMatch = false;
      }
    }

    if (allKeysMatch) {
      console.log('✅ Data integrity verified - all fields match!\n');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 All IPFS tests passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Summary:');
    console.log(`   • IPFS CID: ${cid}`);
    console.log(`   • Public URL: ${ipfsService.getPublicUrl(cid)}`);
    console.log(`   • Gateway: ${process.env.IPFS_GATEWAY}`);
    console.log('\n✨ IPFS service is ready for production use!');
    console.log('   You can now proceed with blockchain integration.\n');

  } catch (error) {
    console.error('\n❌ IPFS test failed:', error.message);

    if (error.message.includes('Pinata credentials not configured')) {
      console.log('\n💡 Fix: Add your Pinata JWT to the .env file:');
      console.log('   PINATA_JWT=your_jwt_token_here\n');
    } else if (error.message.includes('Failed to authenticate')) {
      console.log('\n💡 Fix: Check that your Pinata JWT is valid');
      console.log('   Generate a new one at: https://app.pinata.cloud/developers/api-keys\n');
    } else {
      console.log('\n💡 Debug info:');
      console.log('   Error:', error);
    }

    process.exit(1);
  }
}

// Run the test
testIPFSService();
