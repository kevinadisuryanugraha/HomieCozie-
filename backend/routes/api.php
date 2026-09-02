<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\CRMController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\WaiterCallController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\WhatsAppController;
use App\Http\Controllers\Api\CashShiftController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\CmsController;
use App\Http\Controllers\Api\TelemetryController;

Route::prefix('v1')->group(function () {

    // =========================================================================
    // 🌐 1. PUBLIC CUSTOMER-FACING ENDPOINTS (Rate-Limited & Sanitized)
    // =========================================================================

    // 1.1 Authentication & Member OTP
    Route::post('/auth/login-staff', [AuthController::class, 'loginStaff'])->middleware('throttle:10,1');
    Route::post('/auth/login-member-otp', [AuthController::class, 'loginMemberOTP'])->middleware('throttle:5,1');

    // 1.2 Public Catalog & Storefront Data
    Route::get('/menu', [MenuController::class, 'index']);
    Route::get('/menu/{id}', [MenuController::class, 'show']);
    Route::get('/tables', [TableController::class, 'index']);
    Route::patch('/tables/{id}/status', [TableController::class, 'updateStatus']);

    // 1.3 Public Customer Orders & Status Tracker
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:30,1');
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // 1.4 Customer Table Booking
    Route::post('/reservations', [ReservationController::class, 'store'])->middleware('throttle:10,1');

    // 1.5 Table Waiter Assistance Calling
    Route::post('/waiter-calls', [WaiterCallController::class, 'store'])->middleware('throttle:20,1');

    // 1.6 Payment Gateway & Dynamic QRIS
    Route::post('/payment/charge', [PaymentController::class, 'chargeQRIS']);
    Route::post('/payment/webhook', [PaymentController::class, 'handleWebhook']);
    Route::get('/payment/status/{id}', [PaymentController::class, 'checkStatus']);

    // 1.7 Public CMS Content & Cafe Info
    Route::get('/cms/banners', [CmsController::class, 'getBanners']);
    Route::get('/cms/events', [CmsController::class, 'getEvents']);
    Route::get('/cms/settings', [CmsController::class, 'getSettings']);

    // 1.8 Anonymous Telemetry Stream (High-Throughput Ingestion)
    Route::post('/telemetry/event', [TelemetryController::class, 'trackEvent'])->middleware('throttle:60,1');


    // =========================================================================
    // 🔒 2. PROTECTED BACKOFFICE & STAFF MANAGEMENT ENDPOINTS (Sanctum Auth)
    // =========================================================================
    Route::middleware(['auth:sanctum'])->group(function () {

        // 2.1 Authenticated Staff Profile & Session Lifecycle
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // 2.2 Table & Floor Plan Management
        Route::patch('/tables/{id}/status', [TableController::class, 'updateStatus']);

        // 2.3 Operations Order Processing & KDS Updates
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // 2.4 Reservation Book & Seating
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

        // 2.5 Inventory Stock, Burn Rate & Automated PO Generator
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::patch('/inventory/{id}/stock', [InventoryController::class, 'updateStock']);
        Route::post('/inventory/{id}/restock', [InventoryController::class, 'restock']);
        Route::get('/inventory/predictions', [InventoryController::class, 'burnRatePredictions']);
        Route::post('/inventory/generate-po', [InventoryController::class, 'generatePO']);

        // 2.6 Recipe BOM Engine & COGS Costing
        Route::get('/recipes', [RecipeController::class, 'index']);
        Route::get('/recipes/{id}', [RecipeController::class, 'show']);
        Route::put('/recipes/{id}', [RecipeController::class, 'update']);

        // 2.7 CRM & VIP Customer Database
        Route::get('/crm/members', [CRMController::class, 'index']);
        Route::post('/crm/members/{id}/points', [CRMController::class, 'addPoints']);

        // 2.8 Financial Analytics, DPP & PB1 10% Municipal Tax Reports
        Route::get('/analytics/summary', [AnalyticsController::class, 'summary']);
        Route::get('/analytics/tax-report', [AnalyticsController::class, 'taxReport']);
        Route::get('/analytics/export-csv', [AnalyticsController::class, 'exportCSV']);

        // 2.9 Operational Waiter Call Resolution
        Route::get('/waiter-calls', [WaiterCallController::class, 'index']);
        Route::patch('/waiter-calls/{id}/resolve', [WaiterCallController::class, 'resolve']);

        // 2.10 Security Audit Logs & Access Trail
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        Route::post('/audit-logs', [AuditLogController::class, 'store']);

        // 2.11 WhatsApp Gateway Automations
        Route::post('/whatsapp/send-reservation-ticket', [WhatsAppController::class, 'sendReservationTicket']);
        Route::post('/whatsapp/send-receipt', [WhatsAppController::class, 'sendReceipt']);
        Route::post('/whatsapp/send-daily-closing-report', [WhatsAppController::class, 'sendDailyClosingReport']);

        // 2.12 Cashier Shift Reconciliation & Z-Report
        Route::get('/shifts/current', [CashShiftController::class, 'current']);
        Route::post('/shifts/open', [CashShiftController::class, 'open']);
        Route::post('/shifts/close', [CashShiftController::class, 'close']);
        Route::get('/shifts/history', [CashShiftController::class, 'history']);

        // 2.13 Multi-Outlet Branch Administration
        Route::get('/outlets', [OutletController::class, 'index']);
        Route::get('/outlets/{id}', [OutletController::class, 'show']);

        // 2.14 Backoffice CMS Administration (Content & Menu Items)
        Route::post('/cms/banners', [CmsController::class, 'storeBanner']);
        Route::put('/cms/banners/{id}', [CmsController::class, 'updateBanner']);
        Route::delete('/cms/banners/{id}', [CmsController::class, 'deleteBanner']);

        Route::post('/cms/events', [CmsController::class, 'storeEvent']);
        Route::put('/cms/events/{id}', [CmsController::class, 'updateEvent']);
        Route::delete('/cms/events/{id}', [CmsController::class, 'deleteEvent']);

        Route::post('/cms/settings', [CmsController::class, 'updateSettings']);

        Route::post('/cms/menu-items', [CmsController::class, 'storeMenuItem']);
        Route::put('/cms/menu-items/{id}', [CmsController::class, 'updateMenuItem']);
        Route::patch('/cms/menu-items/{id}/toggle-availability', [CmsController::class, 'toggleMenuItemAvailability']);
        Route::delete('/cms/menu-items/{id}', [CmsController::class, 'deleteMenuItem']);

        // 2.15 Visitor Intelligence & Conversion Radar
        Route::get('/analytics/visitor-intelligence', [TelemetryController::class, 'getVisitorAnalytics']);
        Route::get('/analytics/live-visitors', [TelemetryController::class, 'getLiveVisitors']);
    });
});
