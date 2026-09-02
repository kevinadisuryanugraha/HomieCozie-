<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Models\TableItem;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\InventoryItem;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\CustomerMember;
use App\Models\Reservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\AuditLog;
use App\Models\BOMDeductionLog;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. SEED ROLES
        $rolesData = [
            ['name' => 'super_admin', 'label' => 'Super Admin (Hansco Tech)', 'badge_color' => 'bg-purple-900/40 text-purple-300 border-purple-700', 'icon' => '⚡', 'description' => 'Kontrol teknis penuh sistem, konfigurasi server & master database'],
            ['name' => 'owner', 'label' => 'Owner (Pemilik Kafe)', 'badge_color' => 'bg-amber-900/40 text-amber-300 border-amber-700', 'icon' => '👑', 'description' => 'Pemilik bisnis: Laporan laba-rugi, persetujuan diskon/void, kontrol penuh resto'],
            ['name' => 'manager', 'label' => 'Manager / Supervisor', 'badge_color' => 'bg-blue-900/40 text-blue-300 border-blue-700', 'icon' => '💼', 'description' => 'Operasional harian: Manajemen shift, stok, void kasir, analitik harian'],
            ['name' => 'cashier', 'label' => 'Kasir Frontline', 'badge_color' => 'bg-emerald-900/40 text-emerald-300 border-emerald-700', 'icon' => '💳', 'description' => 'Proses pembayaran meja, cetak struk thermal, input poin member saat bayar'],
            ['name' => 'reservation_staff', 'label' => 'Staff Reservasi', 'badge_color' => 'bg-teal-900/40 text-teal-300 border-teal-700', 'icon' => '📅', 'description' => 'Manajemen ketersediaan meja, alokasi kursi, konfirmasi WhatsApp reservasi'],
            ['name' => 'kitchen_staff', 'label' => 'Staff Dapur & Barista', 'badge_color' => 'bg-orange-900/40 text-orange-300 border-orange-700', 'icon' => '🍳', 'description' => 'Layar KDS (Kitchen Display), status racikan pesanan, laporan stok menipis'],
            ['name' => 'marketing', 'label' => 'Marketing & Admin Sosmed', 'badge_color' => 'bg-pink-900/40 text-pink-300 border-pink-700', 'icon' => '📢', 'description' => 'Broadcast promosi WhatsApp, kalender event #PITSTOP & Live Music'],
            ['name' => 'member', 'label' => 'Member Pelanggan VIP', 'badge_color' => 'bg-indigo-900/40 text-indigo-300 border-indigo-700', 'icon' => '⭐', 'description' => 'Pelanggan terdaftar: Cozie Points, riwayat transaksi, voucher promo'],
            ['name' => 'guest', 'label' => 'Guest (Tamu Publik)', 'badge_color' => 'bg-stone-800 text-stone-300 border-stone-700', 'icon' => '👤', 'description' => 'Pengunjung tanpa akun: Lihat menu, booking meja, scan QR order'],
        ];

        $roles = [];
        foreach ($rolesData as $r) {
            $roles[$r['name']] = Role::create($r);
        }

        // 2. SEED PERMISSIONS & RBAC MATRIX (PRD Section 8.3)
        $permissionsData = [
            ['code' => 'MOD-WEB', 'name' => 'Konten Website & Menu', 'category' => 'Website & Reservasi', 'desc' => 'Mengubah harga menu, banner promo, galeri foto, dan SEO metadata.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'E', 'cashier' => 'T', 'reservation_staff' => 'T', 'kitchen_staff' => 'L', 'marketing' => 'E', 'member' => 'L', 'guest' => 'L']],
            ['code' => 'MOD-RES', 'name' => 'Reservasi & Booking Meja', 'category' => 'Website & Reservasi', 'desc' => 'Menerima, mengubah status meja, konfirmasi WA, dan assign nomor meja.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'F', 'cashier' => 'L', 'reservation_staff' => 'F', 'kitchen_staff' => 'T', 'marketing' => 'L', 'member' => 'E', 'guest' => 'E']],
            ['code' => 'MOD-POS', 'name' => 'Order & Kasir (POS / KDS)', 'category' => 'Operasional & Kasir', 'desc' => 'Buka bill meja, input pesanan, proses QRIS/Cash, cetak struk, dan update KDS dapur.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'F', 'cashier' => 'F', 'reservation_staff' => 'T', 'kitchen_staff' => 'L', 'marketing' => 'T', 'member' => 'E', 'guest' => 'E']],
            ['code' => 'MOD-INV', 'name' => 'Inventori & Stok Bahan', 'category' => 'Operasional & Kasir', 'desc' => 'Audit stok kopi, susu, sirup, penyesuaian waste bahan, dan input purchase order.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'F', 'cashier' => 'L', 'reservation_staff' => 'T', 'kitchen_staff' => 'E', 'marketing' => 'T', 'member' => 'T', 'guest' => 'T']],
            ['code' => 'MOD-CRM', 'name' => 'CRM & Program Loyalitas', 'category' => 'CRM & Marketing', 'desc' => 'Database pelanggan, manajemen Cozie Points, broadcast WhatsApp promo, dan voucher ultah.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'L', 'cashier' => 'E', 'reservation_staff' => 'L', 'kitchen_staff' => 'T', 'marketing' => 'F', 'member' => 'L', 'guest' => 'T']],
            ['code' => 'MOD-HR', 'name' => 'Manajemen Staf & Shift', 'category' => 'Sistem & Governance', 'desc' => 'Pengaturan jadwal kerja barista & kitchen, absensi, dan jam lembur.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'F', 'cashier' => 'L', 'reservation_staff' => 'L', 'kitchen_staff' => 'L', 'marketing' => 'L', 'member' => 'T', 'guest' => 'T']],
            ['code' => 'MOD-ANA', 'name' => 'Analitik & Laporan Omzet', 'category' => 'CRM & Marketing', 'desc' => 'Dashboard penjualan real-time, profit margin, laporan COGS, dan traffic acquisition.', 'matrix' => ['super_admin' => 'F', 'owner' => 'F', 'manager' => 'F', 'cashier' => 'T', 'reservation_staff' => 'T', 'kitchen_staff' => 'T', 'marketing' => 'L', 'member' => 'T', 'guest' => 'T']],
            ['code' => 'MOD-CFG', 'name' => 'Pengaturan Sistem & Integrasi', 'category' => 'Sistem & Governance', 'desc' => 'Koneksi payment gateway (Midtrans/Xendit), WA Business API, dan domain VPS.', 'matrix' => ['super_admin' => 'F', 'owner' => 'E', 'manager' => 'T', 'cashier' => 'T', 'reservation_staff' => 'T', 'kitchen_staff' => 'T', 'marketing' => 'T', 'member' => 'T', 'guest' => 'T']],
            ['code' => 'MOD-USR', 'name' => 'Manajemen User & Role (RBAC)', 'category' => 'Sistem & Governance', 'desc' => 'Tambah akun staff, reset password, nonaktifkan akun resign, dan konfigurasi permission.', 'matrix' => ['super_admin' => 'F', 'owner' => 'E', 'manager' => 'L', 'cashier' => 'T', 'reservation_staff' => 'T', 'kitchen_staff' => 'T', 'marketing' => 'T', 'member' => 'T', 'guest' => 'T']],
        ];

        foreach ($permissionsData as $p) {
            $perm = Permission::create([
                'module_code' => $p['code'],
                'module_name' => $p['name'],
                'category' => $p['category'],
                'description' => $p['desc'],
            ]);

            foreach ($p['matrix'] as $roleName => $level) {
                if (isset($roles[$roleName])) {
                    $perm->roles()->attach($roles[$roleName]->id, ['permission_level' => $level]);
                }
            }
        }

        // 3. SEED USERS (MATCHING DEMO_ACCOUNTS.md)
        $usersData = [
            ['name' => 'Hansco Tech Director', 'email' => 'director@hanscodigital.com', 'password' => 'HanscoAdmin#2026', 'role' => 'super_admin', 'phone' => '081122334455', 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => true, 'two_factor_secret' => '882026'],
            ['name' => 'Pak Hendra (Owner)', 'email' => 'owner@homiecozie.com', 'password' => 'HomieOwner#2026', 'role' => 'owner', 'phone' => '081586402420', 'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => true, 'two_factor_secret' => '882026'],
            ['name' => 'Rahmat (Supervisor)', 'email' => 'manager@homiecozie.com', 'password' => 'ManagerCozie#2026', 'role' => 'manager', 'phone' => '081234567890', 'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
            ['name' => 'Sinta (Kasir Shift Pagi)', 'email' => 'kasir@homiecozie.com', 'password' => 'KasirHomie#2026', 'role' => 'cashier', 'phone' => '081298765401', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
            ['name' => 'Bayu (Staff Reservasi & Front)', 'email' => 'reservasi@homiecozie.com', 'password' => 'Reservasi#2026', 'role' => 'reservation_staff', 'phone' => '081298765402', 'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
            ['name' => 'Doni (Head Barista & Kitchen)', 'email' => 'dapur@homiecozie.com', 'password' => 'DapurHomie#2026', 'role' => 'kitchen_staff', 'phone' => '081298765403', 'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
            ['name' => 'Clarissa (Admin Sosmed)', 'email' => 'marketing@homiecozie.com', 'password' => 'Marketing#2026', 'role' => 'marketing', 'phone' => '081298765404', 'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
            ['name' => 'Dimas Aditya (Member Gold)', 'email' => 'dimas.aditya@gmail.com', 'password' => 'Member#2026', 'role' => 'member', 'phone' => '081298765432', 'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
            ['name' => 'Tamu Publik (Guest)', 'email' => 'guest@homiecozie.local', 'password' => 'Guest#2026', 'role' => 'guest', 'phone' => null, 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', 'two_factor_enabled' => false],
        ];

        foreach ($usersData as $u) {
            User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make($u['password']),
                'role_id' => $roles[$u['role']]->id,
                'phone' => $u['phone'],
                'avatar' => $u['avatar'],
                'two_factor_enabled' => $u['two_factor_enabled'] ?? false,
                'two_factor_secret' => $u['two_factor_secret'] ?? null,
                'is_active' => true,
                'last_login_at' => now(),
            ]);
        }

        // 4. SEED TABLES (FLOOR PLAN)
        $tablesData = [
            ['table_number' => '01', 'name' => 'Meja 01 - Bar Espresso Corner', 'area' => 'indoor', 'area_label' => 'Indoor AC Utama', 'capacity' => 2, 'status' => 'available'],
            ['table_number' => '02', 'name' => 'Meja 02 - Sofa Hangat Jendela', 'area' => 'indoor', 'area_label' => 'Indoor AC Utama', 'capacity' => 4, 'status' => 'occupied', 'current_customer' => 'Dimas Aditya', 'occupied_since' => '19:48 WIB'],
            ['table_number' => '03', 'name' => 'Meja 03 - Meja Tengah WFH Sharing', 'area' => 'indoor', 'area_label' => 'Indoor AC Utama', 'capacity' => 6, 'status' => 'available'],
            ['table_number' => '04', 'name' => 'Meja 04 - VIP Stage Front Row', 'area' => 'stage', 'area_label' => 'Semi-Outdoor Stage', 'capacity' => 4, 'status' => 'reserved', 'current_customer' => 'Rian Hidayat', 'reserved_for_time' => '20:00 WIB'],
            ['table_number' => '05', 'name' => 'Meja 05 - Acoustic Center', 'area' => 'stage', 'area_label' => 'Semi-Outdoor Stage', 'capacity' => 6, 'status' => 'available'],
            ['table_number' => '06', 'name' => 'Meja 06 - Garden Rindang Pohon', 'area' => 'garden', 'area_label' => 'Backyard Garden', 'capacity' => 4, 'status' => 'occupied', 'current_customer' => 'Bima Satria', 'occupied_since' => '20:12 WIB'],
            ['table_number' => '07', 'name' => 'Meja 07 - Garden Smoking Deck', 'area' => 'garden', 'area_label' => 'Backyard Garden', 'capacity' => 8, 'status' => 'available'],
            ['table_number' => '08', 'name' => 'Meja 08 - Mezzanine Loft VIP', 'area' => 'mezzanine', 'area_label' => 'Mezzanine VIP Floor', 'capacity' => 10, 'status' => 'cleaning'],
        ];

        foreach ($tablesData as $t) {
            TableItem::create($t);
        }

        // 5. SEED MENU CATEGORIES
        $categoriesData = [
            ['slug' => 'coffee', 'name' => 'Coffee & Espresso', 'icon' => 'Coffee', 'sort_order' => 1],
            ['slug' => 'manual-brew', 'name' => 'Manual Brew Bar', 'icon' => 'FlaskConical', 'sort_order' => 2],
            ['slug' => 'non-coffee', 'name' => 'Artisan Non-Coffee', 'icon' => 'CupSoda', 'sort_order' => 3],
            ['slug' => 'kitchen-mains', 'name' => 'Kitchen Mains (Nasi & Daging)', 'icon' => 'Utensils', 'sort_order' => 4],
            ['slug' => 'pasta-rice', 'name' => 'Pasta & Western Comfort', 'icon' => 'Soup', 'sort_order' => 5],
            ['slug' => 'light-bites', 'name' => 'Light Bites & Cemilan', 'icon' => 'Cookie', 'sort_order' => 6],
            ['slug' => 'pastry-dessert', 'name' => 'Pastry & Dessert', 'icon' => 'Cake', 'sort_order' => 7],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = MenuCategory::create($c);
        }

        // 6. SEED MENU ITEMS
        $menuItemsData = [
            [
                'item_code' => 'm-1', 'category_slug' => 'coffee', 'name' => 'Kopi Susu Homie Signature', 'slug' => 'kopi-susu-homie-signature',
                'price' => 24000, 'description' => 'Espresso blend pilihan dengan gula aren organik murni, susu segar gurih, dan tekstur creamy khas resep 6 tahun Homie Cozie.',
                'image' => '/photos/homie_cozie_008.jpg', 'is_bestseller' => true, 'is_chef_special' => false, 'is_new' => false,
                'tags' => ['Best Seller', 'Signature', 'House Blend'], 'taste_profile' => 'Nutty, Sweet Caramel, Rich Body', 'prep_time' => 4,
                'options' => ['sugarLevels' => ['Normal Sweet (100%)', 'Less Sweet (70%)', 'Slightly Sweet (30%)', 'No Sugar'], 'iceLevels' => ['Normal Ice', 'Less Ice', 'No Ice'], 'milkType' => ['Fresh Milk (Standard)', 'Oat Milk (+8k)', 'Soy Milk (+6k)']]
            ],
            [
                'item_code' => 'm-2', 'category_slug' => 'coffee', 'name' => 'Aren Cremosa Cozie', 'slug' => 'aren-cremosa-cozie',
                'price' => 28000, 'description' => 'Double shot espresso dengan layer salted caramel cream lembut di atasnya dan taburan brown sugar torched.',
                'image' => '/photos/homie_cozie_100.jpg', 'is_bestseller' => true, 'is_chef_special' => true, 'is_new' => false,
                'tags' => ['Chef Pick', 'Trending', 'Sweet Tooth'], 'taste_profile' => 'Creamy Velvet, Light Salty Sweet', 'prep_time' => 5,
                'options' => ['sugarLevels' => ['Normal Sweet', 'Less Sweet'], 'iceLevels' => ['Normal Ice', 'Less Ice']]
            ],
            [
                'item_code' => 'm-3', 'category_slug' => 'manual-brew', 'name' => 'V60 Single Origin (Aceh Gayo / Flores)', 'slug' => 'v60-single-origin',
                'price' => 30000, 'description' => 'Seduhan manual filter V60 dengan biji kopi arabika specialty Nusantara, disangrai medium untuk aroma floral dan fruity.',
                'image' => '/photos/homie_cozie_026.png', 'is_bestseller' => false, 'is_chef_special' => true, 'is_new' => false,
                'tags' => ['Specialty', 'Single Origin', 'Slow Bar'], 'taste_profile' => 'Bright Acidity, Jasmine Floral, Peach Finish', 'prep_time' => 8,
                'options' => ['beans' => ['Aceh Gayo Natural', 'Flores Bajawa Washed', 'Kerinci Honey (+3k)']]
            ],
            [
                'item_code' => 'm-4', 'category_slug' => 'non-coffee', 'name' => 'Berry Hibiscus Citrus Sparkler', 'slug' => 'berry-hibiscus-sparkler',
                'price' => 26000, 'description' => 'Konsentrat teh hibiscus merah alami dengan sirup beri liar, soda dingin, perasan jeruk lemon segar, dan daun mint.',
                'image' => '/photos/homie_cozie_128.jpg', 'is_bestseller' => false, 'is_chef_special' => false, 'is_new' => true,
                'tags' => ['Artisan Soda', 'Refreshing', 'Non-Coffee'], 'taste_profile' => 'Tart Citrus, Sparkling Berry, Cool Mint', 'prep_time' => 4,
                'options' => ['sugarLevels' => ['Normal Sweet', 'Less Sweet']]
            ],
            [
                'item_code' => 'm-5', 'category_slug' => 'kitchen-mains', 'name' => 'Nasi Goreng Kampung Homie', 'slug' => 'nasi-goreng-kampung-homie',
                'price' => 36000, 'description' => 'Nasi goreng racikan bumbu khas Pasar Rebo dengan suwiran ayam gurih, potongan smoked beef, telur ceplok omega, acar, dan kerupuk udang.',
                'image' => '/photos/homie_cozie_105.jpg', 'is_bestseller' => true, 'is_chef_special' => false, 'is_new' => false,
                'tags' => ['Best Seller', 'Comfort Food', 'Porsi Kenyang'], 'taste_profile' => 'Savory Smokey, Umami Terasi, Mild Spicy', 'prep_time' => 12,
                'options' => ['spiciness' => ['Tidak Pedas', 'Pedas Sedang', 'Pedas Mantap', 'Super Pedas']]
            ],
            [
                'item_code' => 'm-6', 'category_slug' => 'pasta-rice', 'name' => 'Creamy Truffle Beef Fettuccine', 'slug' => 'creamy-truffle-beef-fettuccine',
                'price' => 42000, 'description' => 'Pasta fettuccine al dente dibalut saus krim truffle harum, lembaran smoked beef gurih, jamur kancing tumis, dan parutan keju parmesan.',
                'image' => '/photos/homie_cozie_050.jpg', 'is_bestseller' => false, 'is_chef_special' => true, 'is_new' => false,
                'tags' => ['Chef Recommended', 'Truffle Scent', 'Western'], 'taste_profile' => 'Rich Truffle Aroma, Creamy Butter, Savory Cheese', 'prep_time' => 15,
                'options' => ['spiciness' => ['Original', 'Extra Chili Flakes']]
            ],
            [
                'item_code' => 'm-7', 'category_slug' => 'light-bites', 'name' => 'Platter Nongkrong #PITSTOP', 'slug' => 'platter-nongkrong-pitstop',
                'price' => 38000, 'description' => 'Kombinasi camilan lengkap untuk 2-3 orang: Truffle Shoestring Fries renyah, Sosis Sapi Bratwurst panggang, Chicken Karaage Bites, saus BBQ & Mayo pedas.',
                'image' => '/photos/homie_cozie_051.jpg', 'is_bestseller' => true, 'is_chef_special' => false, 'is_new' => false,
                'tags' => ['Best Seller', 'Sharing Platter', 'Community Favorite'], 'taste_profile' => 'Crispy Crunchy, Savory Herb, Spicy Dip', 'prep_time' => 10,
                'options' => []
            ],
            [
                'item_code' => 'm-8', 'category_slug' => 'pastry-dessert', 'name' => 'Flaky Croissant Butter with Gelato', 'slug' => 'croissant-butter-gelato',
                'price' => 32000, 'description' => 'Croissant mentega Prancis berlapis renyah dipanggang hangat, disajikan dengan 1 scoop es krim artisan vanilla dan saus karamel lumer.',
                'image' => '/photos/homie_cozie_086.jpg', 'is_bestseller' => false, 'is_chef_special' => false, 'is_new' => true,
                'tags' => ['French Pastry', 'Artisan Sweet', 'Warm & Cold'], 'taste_profile' => 'Flaky Butter, Sweet Vanilla Ice Cream, Caramel Drizzle', 'prep_time' => 6,
                'options' => []
            ],
        ];

        $createdMenuItems = [];
        foreach ($menuItemsData as $m) {
            $cat = $categories[$m['category_slug']];
            $item = MenuItem::create([
                'item_code' => $m['item_code'],
                'category_id' => $cat->id,
                'name' => $m['name'],
                'slug' => $m['slug'],
                'price' => $m['price'],
                'description' => $m['description'],
                'image' => $m['image'],
                'is_bestseller' => $m['is_bestseller'],
                'is_chef_special' => $m['is_chef_special'],
                'is_new' => $m['is_new'],
                'available' => true,
                'preparation_time_minutes' => $m['prep_time'],
                'tags' => $m['tags'],
                'taste_profile' => $m['taste_profile'],
                'options_config' => $m['options'],
            ]);
            $createdMenuItems[$m['item_code']] = $item;
        }

        // 7. SEED INVENTORY ITEMS
        $inventoryData = [
            ['item_code' => 'inv-1', 'name' => 'Arabika House Blend Beans (Homie)', 'category' => 'coffee_beans', 'current_stock' => 14.8, 'min_stock' => 5.0, 'unit' => 'kg', 'cost_per_unit' => 180000, 'supplier' => 'Roastery Nusantara Jakarta', 'status' => 'optimal'],
            ['item_code' => 'inv-2', 'name' => 'Fresh Milk Pasteurized Full Cream', 'category' => 'dairy', 'current_stock' => 24.0, 'min_stock' => 12.0, 'unit' => 'liter', 'cost_per_unit' => 22000, 'supplier' => 'Dairy Fresh Lembang', 'status' => 'optimal'],
            ['item_code' => 'inv-3', 'name' => 'Daging Sapi Smoked Beef & Ayam', 'category' => 'kitchen_meat', 'current_stock' => 8.5, 'min_stock' => 4.0, 'unit' => 'kg', 'cost_per_unit' => 75000, 'supplier' => 'Meat Distributor Jaktim', 'status' => 'optimal'],
            ['item_code' => 'inv-4', 'name' => 'Gula Aren Organik Cair Murni', 'category' => 'syrups', 'current_stock' => 3.2, 'min_stock' => 5.0, 'unit' => 'liter', 'cost_per_unit' => 35000, 'supplier' => 'Aren Organik Lebak', 'status' => 'warning'],
            ['item_code' => 'inv-so-1', 'name' => 'Single Origin Aceh Gayo Beans', 'category' => 'coffee_beans', 'current_stock' => 2.4, 'min_stock' => 2.0, 'unit' => 'kg', 'cost_per_unit' => 320000, 'supplier' => 'Gayo Specialty Direct', 'status' => 'optimal'],
            ['item_code' => 'inv-rice-1', 'name' => 'Beras Pulen Super (Masak)', 'category' => 'produce', 'current_stock' => 25.0, 'min_stock' => 10.0, 'unit' => 'kg', 'cost_per_unit' => 18000, 'supplier' => 'Pasar Induk Kramat Jati', 'status' => 'optimal'],
            ['item_code' => 'inv-pkg-1', 'name' => 'Paper Cup & Lid 12oz Eco', 'category' => 'packaging', 'current_stock' => 180, 'min_stock' => 100, 'unit' => 'pcs', 'cost_per_unit' => 850, 'supplier' => 'Packaging Jaya Mandiri', 'status' => 'optimal'],
        ];

        $invMap = [];
        foreach ($inventoryData as $inv) {
            $created = InventoryItem::create($inv);
            $invMap[$inv['item_code']] = $created;
        }

        // 8. SEED RECIPES & RECIPE INGREDIENTS (BOM ENGINE)
        $recipesData = [
            [
                'item_code' => 'm-1', 'recipe_code' => 'REC-KOPISUSU',
                'prep_notes' => 'Ekstraksi espresso 30ml (ratio 1:2 dalam 27 detik). Steam susu hingga 65°C.',
                'ingredients' => [
                    ['inv_code' => 'inv-1', 'name' => 'Arabika House Blend Beans', 'qty' => 18, 'unit' => 'gram', 'cost' => 180],
                    ['inv_code' => 'inv-2', 'name' => 'Fresh Milk Pasteurized', 'qty' => 120, 'unit' => 'ml', 'cost' => 22],
                    ['inv_code' => 'inv-4', 'name' => 'Gula Aren Organik Cair', 'qty' => 25, 'unit' => 'ml', 'cost' => 35],
                    ['inv_code' => 'inv-pkg-1', 'name' => 'Paper Cup & Lid 12oz', 'qty' => 1, 'unit' => 'pcs', 'cost' => 850],
                ]
            ],
            [
                'item_code' => 'm-5', 'recipe_code' => 'REC-NASGOR',
                'prep_notes' => 'Wok hei api besar, telur ceplok setengah matang on top.',
                'ingredients' => [
                    ['inv_code' => 'inv-rice-1', 'name' => 'Beras Pulen Super (Masak)', 'qty' => 150, 'unit' => 'gram', 'cost' => 18],
                    ['inv_code' => 'inv-3', 'name' => 'Daging Sapi Smoked Beef & Ayam', 'qty' => 80, 'unit' => 'gram', 'cost' => 75],
                ]
            ],
        ];

        foreach ($recipesData as $r) {
            if (isset($createdMenuItems[$r['item_code']])) {
                $menuItem = $createdMenuItems[$r['item_code']];
                $recipe = Recipe::create([
                    'menu_item_id' => $menuItem->id,
                    'recipe_code' => $r['recipe_code'],
                    'preparation_notes' => $r['prep_notes'],
                ]);

                foreach ($r['ingredients'] as $ing) {
                    $invId = isset($invMap[$ing['inv_code']]) ? $invMap[$ing['inv_code']]->id : null;
                    RecipeIngredient::create([
                        'recipe_id' => $recipe->id,
                        'inventory_item_id' => $invId,
                        'ingredient_name' => $ing['name'],
                        'quantity' => $ing['qty'],
                        'unit' => $ing['unit'],
                        'cost_per_unit' => $ing['cost'],
                        'subtotal_cost' => $ing['qty'] * $ing['cost'],
                    ]);
                }
                $recipe->recalculateHPP();
            }
        }

        // 9. SEED CUSTOMERS CRM
        $customersData = [
            [
                'name' => 'Bima Satria', 'phone' => '0813-8890-1122', 'email' => 'bima.pitstop@gmail.com',
                'tier' => 'Platinum Cozie', 'cozie_points' => 480, 'stamps_count' => 8, 'total_visits' => 34,
                'lifetime_spend' => 1850000, 'favorite_items' => ['Platter Nongkrong', 'Kopi Susu Homie', 'Truffle Fries'],
                'tags' => ['Komunitas #PITSTOP', 'VIP Live Music', 'Weekend Regular'], 'last_visit_at' => now()->subDays(2)
            ],
            [
                'name' => 'Dimas Wicaksono', 'phone' => '0857-1922-3841', 'email' => 'dimas.w@yahoo.com',
                'tier' => 'Gold Cozie', 'cozie_points' => 290, 'stamps_count' => 5, 'total_visits' => 14,
                'lifetime_spend' => 920000, 'favorite_items' => ['Nasi Goreng Kampung', 'Aren Cremosa', 'Croffle Biscoff'],
                'tags' => ['Family Dinner', 'Birthday Month'], 'birthday' => '1995-08-26', 'last_visit_at' => now()->subDays(5)
            ],
        ];

        foreach ($customersData as $c) {
            CustomerMember::create($c);
        }

        // 10. SEED RESERVATIONS
        Reservation::create([
            'booking_code' => '#HC-942182',
            'customer_name' => 'Rian Hidayat',
            'customer_phone' => '081234567800',
            'guest_count' => 4,
            'reservation_date' => now()->toDateString(),
            'time_slot' => '20:00',
            'area_preference' => 'stage',
            'table_number' => '04',
            'special_occasion' => 'gathering',
            'notes' => 'Tolong sediakan kursi dekat panggung musik akustik',
            'status' => 'confirmed',
            'wa_confirmed' => true,
        ]);

        // 11. SEED INITIAL ORDERS & BOM LOGS
        $order = Order::create([
            'order_number' => 'HC-9421',
            'order_type' => 'dine-in',
            'table_number' => '06',
            'customer_name' => 'Bima Satria',
            'customer_phone' => '081298765432',
            'subtotal' => 84000,
            'discount' => 0,
            'dpp' => 84000,
            'tax_pb1' => 8400,
            'service_charge' => 4200,
            'total' => 96600,
            'payment_method' => 'qris',
            'payment_status' => 'paid',
            'status' => 'preparing',
        ]);

        if (isset($createdMenuItems['m-1'])) {
            $order->items()->create([
                'menu_item_id' => $createdMenuItems['m-1']->id,
                'item_name' => 'Kopi Susu Homie Signature',
                'unit_price' => 24000,
                'quantity' => 2,
                'subtotal' => 48000,
                'selected_options' => ['sugar' => 'Less Sweet (70%)', 'ice' => 'Normal Ice'],
            ]);
        }

        if (isset($createdMenuItems['m-5'])) {
            $order->items()->create([
                'menu_item_id' => $createdMenuItems['m-5']->id,
                'item_name' => 'Nasi Goreng Kampung Homie',
                'unit_price' => 36000,
                'quantity' => 1,
                'subtotal' => 36000,
                'selected_options' => ['spiciness' => 'Pedas Mantap'],
            ]);
        }

        // 12. SEED AUDIT LOGS
        AuditLog::create([
            'user_name' => 'Pak Hendra (Owner)',
            'role' => 'owner',
            'action' => 'LOGIN_AUTH_SUCCESS',
            'target_module' => 'MOD-AUTH',
            'status' => 'SUCCESS',
            'ip_address' => '127.0.0.1',
            'details' => '2FA TOTP Verified successfully via Authenticator Code',
        ]);
        AuditLog::create([
            'user_name' => 'Sinta (Kasir Shift Pagi)',
            'role' => 'cashier',
            'action' => 'TRANSACTION_PAID_QRIS',
            'target_module' => 'MOD-POS',
            'status' => 'SUCCESS',
            'ip_address' => '127.0.0.1',
            'details' => 'Table #06 Bill #HC-9421 processed via Dynamic QRIS (Rp 96.600)',
        ]);
    }
}
