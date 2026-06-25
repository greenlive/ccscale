# CC Scale B2B Platform - Comprehensive Test Script

$BASE_URL = "http://localhost:3000"
$ADMIN_URL = "http://localhost:3001"
$API_URL = "http://localhost:8000"

$results = @()

function Test-Url {
    param (
        [string]$Name,
        [string]$Url,
        [string]$ExpectedContent = $null,
        [int]$ExpectedStatus = 200
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        $status = $response.StatusCode
        $passed = $status -eq $ExpectedStatus
        
        if ($ExpectedContent -and $passed) {
            $hasContent = $response.Content -match $ExpectedContent
            $passed = $hasContent
        }
        
        $script:results += [PSCustomObject]@{
            TestName = $Name
            Status = $status
            Passed = $passed
            Message = if ($passed) { "OK" } else { "Status: $status" }
        }
        
        $icon = if ($passed) { "[PASS]" } else { "[FAIL]" }
        Write-Host "$icon $Name - Status: $status" -ForegroundColor $(if ($passed) { "Green" } else { "Red" })
    }
    catch {
        $script:results += [PSCustomObject]@{
            TestName = $Name
            Status = 0
            Passed = $false
            Message = $_.Exception.Message
        }
        Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-Api {
    param (
        [string]$Name,
        [string]$Endpoint,
        [string]$ExpectedContent = $null,
        [int]$ExpectedStatus = 200
    )
    
    Test-Url -Name "API: $Name" -Url "$API_URL$Endpoint" -ExpectedContent $ExpectedContent -ExpectedStatus $ExpectedStatus
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "CC Scale B2B Platform - Comprehensive Test" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# ========== FRONTEND TESTS ==========
Write-Host "--- Testing Frontend (Public Website) ---" -ForegroundColor Yellow
Write-Host ""

Test-Url -Name "Homepage (Root)" -Url "$BASE_URL" -ExpectedStatus 302
Test-Url -Name "Homepage (/en)" -Url "$BASE_URL/en"
Test-Url -Name "Products Page" -Url "$BASE_URL/en/products"
Test-Url -Name "Product Detail" -Url "$BASE_URL/en/products/digital-body-scale-bs-200"
Test-Url -Name "About Page" -Url "$BASE_URL/en/about"
Test-Url -Name "Contact Page" -Url "$BASE_URL/en/contact"
Test-Url -Name "Blog Page" -Url "$BASE_URL/en/blog"
Test-Url -Name "Cases Page" -Url "$BASE_URL/en/cases"
Test-Url -Name "Downloads Page" -Url "$BASE_URL/en/downloads"
Test-Url -Name "OEM Page" -Url "$BASE_URL/en/oem"
Test-Url -Name "Support Page" -Url "$BASE_URL/en/support"
Test-Url -Name "Certifications Page" -Url "$BASE_URL/en/certifications"
Test-Url -Name "Guarantee Page" -Url "$BASE_URL/en/guarantee"
Test-Url -Name "Inquiry Page" -Url "$BASE_URL/en/inquiry"
Test-Url -Name "AI Summary Page" -Url "$BASE_URL/en/ai-summary"
Test-Url -Name "Chinese Homepage" -Url "$BASE_URL/zh"
Test-Url -Name "Chinese Products" -Url "$BASE_URL/zh/products"

# ========== ADMIN TESTS ==========
Write-Host ""
Write-Host "--- Testing Admin Dashboard ---" -ForegroundColor Yellow
Write-Host ""

Test-Url -Name "Admin: Login Page" -Url "$ADMIN_URL/login"
Test-Url -Name "Admin: Dashboard" -Url "$ADMIN_URL/dashboard"
Test-Url -Name "Admin: Products List" -Url "$ADMIN_URL/products"
Test-Url -Name "Admin: Batch Products" -Url "$ADMIN_URL/products/batch"
Test-Url -Name "Admin: New Product" -Url "$ADMIN_URL/products/new"
Test-Url -Name "Admin: Categories" -Url "$ADMIN_URL/categories"
Test-Url -Name "Admin: Inquiries" -Url "$ADMIN_URL/inquiries"
Test-Url -Name "Admin: Blog" -Url "$ADMIN_URL/blog"
Test-Url -Name "Admin: Downloads" -Url "$ADMIN_URL/downloads"
Test-Url -Name "Admin: Users" -Url "$ADMIN_URL/users"
Test-Url -Name "Admin: Settings" -Url "$ADMIN_URL/settings"
Test-Url -Name "Admin: Testimonials" -Url "$ADMIN_URL/testimonials"
Test-Url -Name "Admin: Clients" -Url "$ADMIN_URL/clients"
Test-Url -Name "Admin: Page Content" -Url "$ADMIN_URL/page-content"
Test-Url -Name "Admin: Analytics" -Url "$ADMIN_URL/analytics"
Test-Url -Name "Admin: Profile" -Url "$ADMIN_URL/profile"

# ========== API TESTS ==========
Write-Host ""
Write-Host "--- Testing API Endpoints ---" -ForegroundColor Yellow
Write-Host ""

Test-Api -Name "Products List" -Endpoint "/api/products" -ExpectedContent "nameEn"
Test-Api -Name "Product Categories" -Endpoint "/api/products/categories" -ExpectedContent "nameEn"
Test-Api -Name "Product by Slug" -Endpoint "/api/products/slug/digital-body-scale-bs-200" -ExpectedContent "BS-200"
Test-Api -Name "Product Search" -Endpoint "/api/products/search?q=scale"
Test-Api -Name "Swagger Docs" -Endpoint "/api/docs" -ExpectedContent "swagger"
Test-Api -Name "Health Check" -Endpoint "/api/health"

# ========== STATIC RESOURCES ==========
Write-Host ""
Write-Host "--- Testing Static Resources ---" -ForegroundColor Yellow
Write-Host ""

Test-Url -Name "CSV Template (Admin)" -Url "$ADMIN_URL/templates/product_import_template.csv"
Test-Url -Name "robots.txt" -Url "$BASE_URL/robots.txt"
Test-Url -Name "sitemap.xml" -Url "$BASE_URL/sitemap.xml"

# ========== SUMMARY ==========
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($results | Where-Object { $_.Passed -eq $true }).Count
$failed = ($results | Where-Object { $_.Passed -eq $false }).Count
$total = $results.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "[PASS] Passed: $passed" -ForegroundColor Green
Write-Host "[FAIL] Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failed -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    $results | Where-Object { $_.Passed -eq $false } | ForEach-Object {
        Write-Host "  - $($_.TestName): $($_.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Return exit code
if ($failed -gt 0) { exit 1 } else { exit 0 }