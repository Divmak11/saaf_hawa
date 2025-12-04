#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Saaf Hawa Petition Website
Tests all petition API endpoints end-to-end
"""

import requests
import json
import time
from datetime import datetime
import os
from io import BytesIO
from PIL import Image
import PyPDF2

# Get backend URL from frontend env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except:
        pass
    return "https://clean-air-delhi.preview.emergentagent.com"

BASE_URL = get_backend_url() + "/api"
print(f"Testing backend at: {BASE_URL}")

class PetitionTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_signature_id = None
        self.initial_stats = None
        
    def test_api_health(self):
        """Test basic API connectivity"""
        print("\n=== Testing API Health ===")
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            print(f"✅ API Health Check: {response.status_code} - {response.json()}")
            return True
        except Exception as e:
            print(f"❌ API Health Check Failed: {e}")
            return False
    
    def test_get_petition_stats_initial(self):
        """Test GET /api/petition/stats endpoint - initial state"""
        print("\n=== Testing GET /api/petition/stats (Initial) ===")
        try:
            response = requests.get(f"{self.base_url}/petition/stats", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                # Verify response structure
                if 'total_signatures' in data and 'recent_signatures' in data:
                    print(f"✅ Stats structure valid")
                    print(f"✅ Total signatures: {data['total_signatures']}")
                    print(f"✅ Recent signatures count: {len(data['recent_signatures'])}")
                    
                    # Store initial stats for comparison
                    self.initial_stats = data
                    return True
                else:
                    print(f"❌ Invalid response structure: missing required fields")
                    return False
            else:
                print(f"❌ Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def test_post_petition_sign(self):
        """Test POST /api/petition/sign endpoint"""
        print("\n=== Testing POST /api/petition/sign ===")
        
        # Use realistic test data
        test_data = {
            "name": "Rajesh Kumar Singh",
            "email": "rajesh.singh@example.com", 
            "phone": "+91 98765 43210"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/petition/sign",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                # Verify response structure
                required_fields = ['id', 'name', 'phone', 'timestamp', 'signature_number']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    print(f"✅ All required fields present")
                    print(f"✅ Signature ID: {data['id']}")
                    print(f"✅ Signature Number: {data['signature_number']}")
                    print(f"✅ Name matches: {data['name'] == test_data['name']}")
                    print(f"✅ Phone matches: {data['phone'] == test_data['phone']}")
                    
                    # Store signature ID for later tests
                    self.test_signature_id = data['id']
                    return True
                else:
                    print(f"❌ Missing required fields: {missing_fields}")
                    return False
            else:
                print(f"❌ Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def test_get_petition_stats_after_sign(self):
        """Test GET /api/petition/stats endpoint after signing"""
        print("\n=== Testing GET /api/petition/stats (After Signing) ===")
        
        if not self.initial_stats:
            print("❌ No initial stats to compare with")
            return False
            
        try:
            # Wait a moment for the signature to be processed
            time.sleep(1)
            
            response = requests.get(f"{self.base_url}/petition/stats", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                # Verify signature count increased
                initial_count = self.initial_stats['total_signatures']
                new_count = data['total_signatures']
                
                if new_count > initial_count:
                    print(f"✅ Signature count increased: {initial_count} → {new_count}")
                    
                    # Check if our signature appears in recent signatures
                    recent_names = [sig.get('name', '') for sig in data['recent_signatures']]
                    if 'Rajesh Kumar Singh' in recent_names:
                        print(f"✅ New signature appears in recent signatures")
                    else:
                        print(f"⚠️  New signature not yet in recent signatures (may be timing)")
                    
                    return True
                else:
                    print(f"❌ Signature count did not increase: {initial_count} → {new_count}")
                    return False
            else:
                print(f"❌ Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def test_get_signature_by_id(self):
        """Test GET /api/petition/signature/{id} endpoint"""
        print("\n=== Testing GET /api/petition/signature/{id} ===")
        
        if not self.test_signature_id:
            print("❌ No signature ID available for testing")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/petition/signature/{self.test_signature_id}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                # Verify the signature data
                if data['id'] == self.test_signature_id and data['name'] == 'Rajesh Kumar Singh':
                    print(f"✅ Signature retrieved successfully")
                    print(f"✅ ID matches: {data['id']}")
                    print(f"✅ Name matches: {data['name']}")
                    return True
                else:
                    print(f"❌ Signature data mismatch")
                    return False
            else:
                print(f"❌ Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def test_pdf_generation(self):
        """Test GET /api/petition/download-pdf/{id} endpoint"""
        print("\n=== Testing PDF Generation ===")
        
        if not self.test_signature_id:
            print("❌ No signature ID available for testing")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/petition/download-pdf/{self.test_signature_id}", timeout=15)
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
            print(f"Content-Length: {len(response.content)} bytes")
            
            if response.status_code == 200:
                # Verify it's a PDF
                if response.headers.get('content-type') == 'application/pdf':
                    print(f"✅ PDF content type correct")
                    
                    # Verify PDF content
                    try:
                        pdf_buffer = BytesIO(response.content)
                        pdf_reader = PyPDF2.PdfReader(pdf_buffer)
                        
                        if len(pdf_reader.pages) > 0:
                            print(f"✅ PDF has {len(pdf_reader.pages)} page(s)")
                            
                            # Extract text from first page
                            first_page = pdf_reader.pages[0]
                            text = first_page.extract_text()
                            
                            # Verify key content
                            if "CLEAN AIR! MY RIGHT" in text:
                                print(f"✅ PDF contains correct title")
                            else:
                                print(f"❌ PDF missing title 'CLEAN AIR! MY RIGHT'")
                                return False
                                
                            if "Rajesh Kumar Singh" in text:
                                print(f"✅ PDF contains signer name")
                            else:
                                print(f"❌ PDF missing signer name")
                                return False
                            
                            # Check for Hindi text (should not be present per requirements)
                            hindi_chars = any(ord(char) >= 0x0900 and ord(char) <= 0x097F for char in text)
                            if not hindi_chars:
                                print(f"✅ PDF contains no Hindi text")
                            else:
                                print(f"❌ PDF contains Hindi text (should be English only)")
                                return False
                            
                            print(f"✅ PDF generation successful")
                            return True
                        else:
                            print(f"❌ PDF has no pages")
                            return False
                            
                    except Exception as pdf_e:
                        print(f"❌ PDF parsing error: {pdf_e}")
                        return False
                else:
                    print(f"❌ Wrong content type: {response.headers.get('content-type')}")
                    return False
            else:
                print(f"❌ Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def test_image_generation(self):
        """Test GET /api/petition/download-image/{id} endpoint"""
        print("\n=== Testing Image Generation ===")
        
        if not self.test_signature_id:
            print("❌ No signature ID available for testing")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/petition/download-image/{self.test_signature_id}", timeout=15)
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
            print(f"Content-Length: {len(response.content)} bytes")
            
            if response.status_code == 200:
                # Verify it's an image
                if response.headers.get('content-type') == 'image/png':
                    print(f"✅ Image content type correct")
                    
                    # Verify image content
                    try:
                        image_buffer = BytesIO(response.content)
                        img = Image.open(image_buffer)
                        
                        print(f"✅ Image dimensions: {img.size[0]}x{img.size[1]}")
                        print(f"✅ Image format: {img.format}")
                        
                        if img.size[0] > 0 and img.size[1] > 0:
                            print(f"✅ Image generation successful")
                            return True
                        else:
                            print(f"❌ Invalid image dimensions")
                            return False
                            
                    except Exception as img_e:
                        print(f"❌ Image parsing error: {img_e}")
                        return False
                else:
                    print(f"❌ Wrong content type: {response.headers.get('content-type')}")
                    return False
            else:
                print(f"❌ Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def test_error_cases(self):
        """Test error handling"""
        print("\n=== Testing Error Cases ===")
        
        all_passed = True
        
        # Test invalid signature ID
        try:
            response = requests.get(f"{self.base_url}/petition/signature/invalid-id", timeout=10)
            if response.status_code == 404:
                print(f"✅ Invalid signature ID returns 404")
            else:
                print(f"⚠️  Invalid signature ID returns {response.status_code} (expected 404)")
                all_passed = False
        except Exception as e:
            print(f"❌ Error testing invalid signature ID: {e}")
            all_passed = False
            
        # Test invalid PDF download
        try:
            response = requests.get(f"{self.base_url}/petition/download-pdf/invalid-id", timeout=10)
            if response.status_code == 404:
                print(f"✅ Invalid PDF download returns 404")
            else:
                print(f"⚠️  Invalid PDF download returns {response.status_code} (expected 404)")
                all_passed = False
        except Exception as e:
            print(f"❌ Error testing invalid PDF download: {e}")
            all_passed = False
            
        # Test invalid image download
        try:
            response = requests.get(f"{self.base_url}/petition/download-image/invalid-id", timeout=10)
            if response.status_code == 404:
                print(f"✅ Invalid image download returns 404")
            else:
                print(f"⚠️  Invalid image download returns {response.status_code} (expected 404)")
                all_passed = False
        except Exception as e:
            print(f"❌ Error testing invalid image download: {e}")
            all_passed = False
            
        return all_passed
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend Testing for Saaf Hawa Petition Website")
        print("=" * 80)
        
        tests = [
            ("API Health Check", self.test_api_health),
            ("Initial Petition Stats", self.test_get_petition_stats_initial),
            ("Petition Signing", self.test_post_petition_sign),
            ("Updated Petition Stats", self.test_get_petition_stats_after_sign),
            ("Signature Retrieval", self.test_get_signature_by_id),
            ("PDF Generation", self.test_pdf_generation),
            ("Image Generation", self.test_image_generation),
            ("Error Handling", self.test_error_cases)
        ]
        
        results = {}
        
        for test_name, test_func in tests:
            try:
                result = test_func()
                results[test_name] = result
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                results[test_name] = False
        
        # Summary
        print("\n" + "=" * 80)
        print("🏁 TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED - Backend is working correctly!")
            return True
        else:
            print("⚠️  Some tests failed - Backend needs attention")
            return False

if __name__ == "__main__":
    tester = PetitionTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)