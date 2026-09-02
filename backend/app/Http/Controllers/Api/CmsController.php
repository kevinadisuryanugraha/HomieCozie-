<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CmsBanner;
use App\Models\CmsEvent;
use App\Models\CafeSetting;
use App\Models\MenuItem;
use App\Models\MenuCategory;

class CmsController extends Controller
{
    // ==========================================
    // 1. PROMO BANNERS CRUD
    // ==========================================

    public function getBanners()
    {
        $banners = CmsBanner::orderBy('display_order', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $banners,
        ]);
    }

    public function storeBanner(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'badge_text' => 'nullable|string|max:100',
            'image_url' => 'required|string',
            'cta_text' => 'nullable|string|max:100',
            'cta_link' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        $banner = CmsBanner::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Banner promo berhasil ditambahkan.',
            'data' => $banner,
        ], 201);
    }

    public function updateBanner(Request $request, $id)
    {
        $banner = CmsBanner::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'badge_text' => 'nullable|string|max:100',
            'image_url' => 'sometimes|required|string',
            'cta_text' => 'nullable|string|max:100',
            'cta_link' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        $banner->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Banner promo berhasil diperbarui.',
            'data' => $banner,
        ]);
    }

    public function deleteBanner($id)
    {
        $banner = CmsBanner::findOrFail($id);
        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Banner promo berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 2. COMMUNITY EVENTS & LIVE MUSIC CRUD
    // ==========================================

    public function getEvents()
    {
        $events = CmsEvent::orderBy('event_date', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',
            'performer_name' => 'nullable|string',
            'event_date' => 'required|date',
            'time_slot' => 'required|string',
            'ticket_price' => 'nullable|numeric',
            'quota' => 'nullable|integer',
            'poster_url' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $event = CmsEvent::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal event berhasil ditambahkan.',
            'data' => $event,
        ], 201);
    }

    public function updateEvent(Request $request, $id)
    {
        $event = CmsEvent::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string',
            'performer_name' => 'nullable|string',
            'event_date' => 'sometimes|required|date',
            'time_slot' => 'sometimes|required|string',
            'ticket_price' => 'nullable|numeric',
            'quota' => 'nullable|integer',
            'poster_url' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $event->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal event berhasil diperbarui.',
            'data' => $event,
        ]);
    }

    public function deleteEvent($id)
    {
        $event = CmsEvent::findOrFail($id);
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal event berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 3. CAFE SETTINGS & OPERATIONAL INFO
    // ==========================================

    public function getSettings()
    {
        $settings = CafeSetting::all()->pluck('value', 'key');
        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->all();
        foreach ($data as $key => $value) {
            CafeSetting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan operasional kafe berhasil disimpan.',
            'data' => CafeSetting::all()->pluck('value', 'key'),
        ]);
    }

    // ==========================================
    // 4. FULL MENU ITEMS CMS (CREATE, UPDATE, TOGGLE, DELETE)
    // ==========================================

    public function storeMenuItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_slug' => 'required|string',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'image_url' => 'nullable|string',
            'taste_profile' => 'nullable|string',
            'is_best_seller' => 'nullable|boolean',
            'is_bestseller' => 'nullable|boolean',
            'available' => 'nullable|boolean',
            'is_available' => 'nullable|boolean',
        ]);

        $category = MenuCategory::where('slug', $validated['category_slug'])->first();
        $categoryId = $category ? $category->id : 1;
        $slug = \Illuminate\Support\Str::slug($validated['name']);
        $itemCode = 'HC-M' . rand(100, 999);

        $item = MenuItem::create([
            'category_id' => $categoryId,
            'item_code' => $itemCode,
            'name' => $validated['name'],
            'slug' => $slug,
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'image' => $validated['image'] ?? ($validated['image_url'] ?? 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80'),
            'taste_profile' => $validated['taste_profile'] ?? '',
            'is_bestseller' => $validated['is_bestseller'] ?? ($validated['is_best_seller'] ?? false),
            'available' => $validated['available'] ?? ($validated['is_available'] ?? true),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Menu '{$item->name}' berhasil ditambahkan ke katalog!",
            'data' => $item,
        ], 201);
    }

    public function updateMenuItem(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_slug' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'taste_profile' => 'nullable|string',
            'is_bestseller' => 'nullable|boolean',
            'available' => 'nullable|boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => "Menu '{$item->name}' berhasil diperbarui.",
            'data' => $item,
        ]);
    }

    public function toggleMenuItemAvailability($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->available = !$item->available;
        $item->save();

        $statusText = $item->available ? 'TERSEDIA' : 'HABIS (SOLD OUT)';

        return response()->json([
            'success' => true,
            'message' => "Status menu '{$item->name}' diubah menjadi {$statusText}.",
            'data' => $item,
        ]);
    }

    public function deleteMenuItem($id)
    {
        $item = MenuItem::findOrFail($id);
        $name = $item->name;
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => "Menu '{$name}' berhasil dihapus dari katalog.",
        ]);
    }
}
