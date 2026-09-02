# 🔐 Daftar Akun Demo & Kredensial Login
### Homie Cozie Coffee & Kitchen Management System

Berikut adalah daftar lengkap akun demo, role, hak akses, serta kredensial (email, password, dan OTP) yang dapat digunakan untuk login ke sistem.

---

## 📋 Tabel Kredensial Akun Staff & Management

| No | Role | Nama Lengkap | Email | Password | 2FA / TOTP |
|:---|:---|:---|:---|:---|:---|
| 1 | **Super Admin** | Hansco Tech Director | `director@hanscodigital.com` | `HanscoAdmin#2026` | `882026` *(Aktif)* |
| 2 | **Owner** | Pak Hendra (Owner) | `owner@homiecozie.com` | `HomieOwner#2026` | `882026` *(Aktif)* |
| 3 | **Manager** | Rahmat (Supervisor) | `manager@homiecozie.com` | `ManagerCozie#2026` | *Tidak Perlu* |
| 4 | **Kasir (Cashier)** | Sinta (Kasir Shift Pagi) | `kasir@homiecozie.com` | `KasirHomie#2026` | *Tidak Perlu* |
| 5 | **Staff Reservasi** | Bayu (Staff Reservasi & Front) | `reservasi@homiecozie.com` | `Reservasi#2026` | *Tidak Perlu* |
| 6 | **Staff Dapur / Bar** | Doni (Head Barista & Kitchen) | `dapur@homiecozie.com` | `DapurHomie#2026` | *Tidak Perlu* |
| 7 | **Marketing & Sosmed**| Clarissa (Admin Sosmed) | `marketing@homiecozie.com` | `Marketing#2026` | *Tidak Perlu* |

---

## 📱 Akun Member (Login via WhatsApp OTP)

| Tipe | Nama | No. WhatsApp Demo | Kode OTP | Email Alternatif |
|:---|:---|:---|:---|:---|
| **Member Gold** | Dimas Aditya | `081298765432` | `772026` *(atau 6 digit sembarang)* | `dimas.aditya@gmail.com` |

---

## 👤 Akun Guest / Publik
- **Role:** `guest`
- **Nama:** Tamu Publik
- **Email:** `guest@homiecozie.local`
- **Akses:** Akses default halaman depan tanpa perlu login (lihat menu, reservasi tamu, dsb).

---

## 🔑 Detail Hak Akses per Role (RBAC Matrix)

| Modul | Super Admin | Owner | Manager | Kasir | Reservasi | Dapur | Marketing | Member |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **MOD-RES** (Reservasi) | Full | Full | Full | View | Full | View | View | Buat Booking |
| **MOD-POS** (Kasir & Billing) | Full | Full | Full | Full | View | View | - | - |
| **MOD-KTC** (Kitchen Display) | Full | Full | Full | View | - | Full | - | - |
| **MOD-INV** (Stok & Bahan) | Full | Full | Full | Edit | - | Edit | - | - |
| **MOD-CRM** (Member & Loyalitas)| Full | Full | Full | View | View | - | Full | Lihat Poin |
| **MOD-ANA** (Analitik & Omzet) | Full | Full | Full | - | - | - | Laporan Promo| - |
| **MOD-HR** (Shift & Staf) | Full | Full | Full | Shift Pribadi | Shift Pribadi | Shift Pribadi | Shift Pribadi | - |
| **MOD-CFG** (Pengaturan Sistem) | Full | Approval | - | - | - | - | - | - |
| **MOD-USR** (Manajemen Akun) | Full | Approval | Kelola Staf | - | - | - | - | - |

---

## 💡 Tips Pengujian Cepat
1. **Quick Role Switcher:** Di dalam modal login atau halaman backoffice, Anda juga dapat menggunakan fitur **Quick Switch** untuk langsung berganti peran tanpa mengetik ulang kredensial.
2. **Rate Limiting:** Sistem dilengkapi rate limiting jika salah password 3x (cooldown 30–60 detik).
3. **Master 2FA Code:** Untuk Super Admin dan Owner, gunakan kode master darurat: `882026`.
