import { Button } from "@/components/ui/button"
import { 
    Drawer, 
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchFilters } from "@/types/SearchFilters"
import { useState, useEffect } from "react"
import { useSearchContext } from "@/context/SearchContext"

type FilterProps = {
  mapState?: {
    center: [number, number];
    zoom: number;
  };
};

// Helper function to round time to the nearest 15 minutes
function roundTimeTo15Min(time: string) {
  const [h, m] = time.split(':').map(Number);
  let minutes = Math.round(m / 15) * 15;
  let hours = h;
  if (minutes === 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper to calculate the radius in km based on the zoom level
// TODO: This is a rough approximation and may need to be adjusted based on the map projection
const zoomToRadiusKm = (zoom: number) => {
  const baseRadiusKm = 5.0;
  return baseRadiusKm * (2 ** (13 - zoom));
};

// 'filters' state is the state of the SearchContext
// 'localFilters' state is the state of the Filter component
// 'mapState' is the state of the map inherted from the Home component
export default function Filter({ mapState }: FilterProps) {
  const { filters, updateFilters } = useSearchContext();
  const [localFilters, setLocalFilters] = useState<SearchFilters>({
    ...filters,
    lon: mapState?.center[0] ?? 0,
    lat: mapState?.center[1] ?? 0,
    radius: mapState ? zoomToRadiusKm(mapState.zoom) : zoomToRadiusKm(13),
  });

  // Update local filters when the map state changes
  useEffect(() => {
    if (mapState) {
      setLocalFilters(prev => ({
        ...prev,
        lon: mapState.center[0],
        lat: mapState.center[1],
        radius: zoomToRadiusKm(mapState.zoom)
      }));
    }
    updateFilters(localFilters);
  }, [mapState]);

  // Helper for time input (ensures only 15-min increments)
  const handleTimeChange = (field: 'timeStart' | 'timeEnd', value: string) => {
    const rounded = roundTimeTo15Min(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: rounded
    }));
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className='rounded-full bg-white text-black hover:bg-neutral-100'>Filters</Button>
      </DrawerTrigger>

      <DrawerContent className="h-full top-0 right-0 left-auto mt-0 w-[400px] rounded-none">
        <div className="p-4">
          <DrawerHeader className="p-0">
            <DrawerTitle className="text-[1.5rem]">Search Filters</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Min"
                  type="number"
                  value={localFilters.priceMin || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    priceMin: Number(e.target.value)
                  })}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={localFilters.priceMax || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    priceMax: Number(e.target.value)
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parking Type</label>
              <Select
                value={localFilters.type?.join(',') || ''}
                onValueChange={(value) => setLocalFilters({
                  ...localFilters,
                  type: value ? value.split(',') : undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal,bike,small,disabled">All Types</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                step={900}
                value={localFilters.timeStart || ''}
                onChange={e => handleTimeChange('timeStart', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                step={900}
                value={localFilters.timeEnd || ''}
                onChange={e => handleTimeChange('timeEnd', e.target.value)}
              />
            </div>
          </div>
        </div>
        <DrawerFooter>
            <Button onClick={() => updateFilters(localFilters)}>Apply Filter</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
