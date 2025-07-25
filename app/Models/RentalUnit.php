<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class RentalUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'landlord_id',
        'address',
        'unit_number',
        'availability_status',
        'floor_area',
        'rent_price',
        'property_type',
        'description',
        'amenities',
        'unit_photos'
    ];

    protected $casts = [
        'floor_area' => 'decimal:2',
        'rent_price' => 'decimal:2',
        'amenities' => 'array',
        'unit_photos' => 'array',
    ];

    public function landlord()
    {
        return $this->belongsTo(Landlord::class, 'landlord_id');
    }

    public function rentalUnit()
    {
        return $this->hasMany(RentalUnit::class, 'unit_id');
    }

    public function vacancyNotifications()
    {
        return $this->hasMany(VacancyNotification::class, 'unit_id');
    }

    public function leases()
    {
        return $this->hasMany(Lease::class, 'unit_id');
    }

    public function currentLease()
    {
        return $this->hasOne(Lease::class, 'unit_id')->where('lease_status', 'active');
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class, 'unit_id');
    }

    public function applications()
    {
        return $this->hasMany(RentalApplication::class, 'unit_id');
    }


    /**
     * Get unit photos from existing folder structure
     */
    public function getUnitPhotos(): array
    {
        $photoUrls = [];

        // Get folder mapping
        $folderName = $this->getMappedFolderName();

        if ($folderName && Storage::disk('public')->exists("rental_units/{$folderName}")) {
            // Get all image files from the mapped folder
            $files = Storage::disk('public')->files("rental_units/{$folderName}");

            // Filter for image files and sort them (main.JPG first)
            $imageFiles = collect($files)->filter(function ($file) {
                return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif']);
            })->sort(function ($a, $b) {
                $aName = strtolower(basename($a, '.' . pathinfo($a, PATHINFO_EXTENSION)));
                $bName = strtolower(basename($b, '.' . pathinfo($b, PATHINFO_EXTENSION)));

                // Put main first, then sort alphabetically
                if ($aName === 'main') return -1;
                if ($bName === 'main') return 1;
                return strcmp($aName, $bName);
            });

            // Convert to URLs
            foreach ($imageFiles as $file) {
                $photoUrls[] = Storage::url($file);
            }
        }

        // Fallback to old unit_photos field if no folder mapping exists
        if (empty($photoUrls) && !empty($this->unit_photos)) {
            $photoUrls = is_array($this->unit_photos) ? $this->unit_photos : json_decode($this->unit_photos, true) ?? [];
        }

        return $photoUrls;
    }

    /**
     * Get the mapped folder name for this unit
     */
    private function getMappedFolderName(): ?string
    {
        $mappingFile = storage_path('app/unit_folder_mappings.json');

        if (File::exists($mappingFile)) {
            $mappings = json_decode(File::get($mappingFile), true) ?? [];
            return $mappings[$this->id] ?? null;
        }

        return null;
    }

    public static function getPropertyPerformanceData()
    {
        return self::with([
            'leases:id,unit_id,lease_status',
            'leases.rentalBills:id,lease_id,amount_paid,payment_status,paid_date',
            'maintenanceRequests:id,unit_id,actual_cost,request_status,completion_date'
        ])
            ->selectRaw('id, address, unit_number, rent_price, availability_status')
            ->get()
            ->groupBy('address')
            ->map(function ($units, $address) {
                $totalUnits = $units->count();
                $occupiedUnits = $units->where('availability_status', 'occupied')->count();
                $occupancy = $totalUnits > 0 ? ($occupiedUnits / $totalUnits) * 100 : 0;

                // Calculate average monthly rent for this address
                $avgMonthlyRent = $units->avg('rent_price');

                // Get yearly revenue from all units at this address
                $monthlyRevenue = $units->flatMap(function ($unit) {
                    return $unit->leases->flatMap->rentalBills;
                })
                    ->where('payment_status', 'paid')
                    ->whereNotNull('paid_date')
                    ->filter(function ($bill) {
                        return $bill->paid_date &&
                            $bill->paid_date->year === Carbon::now()->year &&
                            $bill->paid_date->month === Carbon::now()->month;
                    })
                    ->sum('amount_paid');

                $yearlyRevenue = $monthlyRevenue * 12;

                // Get maintenance costs for all units at this address
                $maintenanceCosts = $units->flatMap->maintenanceRequests
                    ->where('request_status', 'completed')
                    ->whereNotNull('actual_cost')
                    ->filter(function ($request) {
                        return $request->completion_date && $request->completion_date->year === Carbon::now()->year;
                    })
                    ->sum('actual_cost');

                $netIncome = $monthlyRevenue - $maintenanceCosts;

                return [
                    'address' => $address,
                    'units' => (int) $totalUnits,
                    'occupancy' => (float) round($occupancy, 1),
                    'monthlyRent' => (float) $avgMonthlyRent,
                    'monthlyRevenue' => (float) $monthlyRevenue,
                    'yearlyRevenue' => (float) $yearlyRevenue,
                    'maintenanceCosts' => (float) $maintenanceCosts,
                    'netIncome' => (float) $netIncome,
                ];
            })
            ->values()
            ->toArray();
    }

    // Keep the original method for backward compatibility
    public static function getPropertyPerformance()
    {
        return collect(self::getPropertyPerformanceData());
    }

    public static function getNumberOfAvailableUnits()
    {
        return DB::table('rental_units')
            ->where('availability_status', '=', 'available')
            ->get()->count();
    }

    public static function getNumberOfOccupiedUnits()
    {
        return DB::table('rental_units')
            ->where('availability_status', '=', 'occupied')
            ->get()->count();
    }

    public static function getDataForTable()
    {
        return RentalUnit::with(['landlord:id,user_name,email,user_contact_number'])->get()->map(function ($unit) {
            return [
                'id' => $unit->id,
                'landlord_id' => $unit->landlord_id,
                'landlord' => [
                    'id' => $unit->landlord->id,
                    'user_name' => $unit->landlord->user_name,
                    'email' => $unit->landlord->email,
                    'user_contact_number' => $unit->landlord->user_contact_number,
                ],
                'address' => $unit->address,
                'unit_number' => $unit->unit_number,
                'availability_status' => $unit->availability_status,
                'floor_area' => $unit->floor_area,
                'rent_price' => $unit->rent_price,
                'property_type' => $unit->property_type,
                'description' => $unit->description,
                'amenities' => $unit->amenities ?? [],
                'unit_photos' => $unit->getUnitPhotos(),
                'created_at' => $unit->created_at->toISOString(),
                'updated_at' => $unit->updated_at->toISOString(),
            ];
        })->toArray();
    }

    public static function getNumberOfUnits()
    {
        return RentalUnit::all()->count();
    }

    public static function getAvailableUnits()
    {
        return DB::table('rental_units')->where('availability_status', '=', 'available')->select('id', 'address', 'unit_number', 'rent_price')->get()->toArray();
    }


    public static function getListingsData()
    {
        return RentalUnit::select('id', 'address', 'unit_number', 'availability_status', 'floor_area', 'rent_price', 'property_type', 'description', 'amenities', 'unit_photos')
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'address' => $unit->address,
                    'unit_number' => $unit->unit_number,
                    'availability_status' => $unit->availability_status,
                    'floor_area' => $unit->floor_area,
                    'rent_price' => $unit->rent_price,
                    'property_type' => $unit->property_type,
                    'description' => $unit->description,
                    'amenities' => $unit->amenities ?? [],
                    'unit_photos' => $unit->getUnitPhotos(),
                ];
            })
            ->toArray();
    }

}
