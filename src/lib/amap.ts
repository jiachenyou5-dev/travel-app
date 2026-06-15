const AMAP_API_KEY = process.env.AMAP_API_KEY;
const AMAP_BASE = "https://restapi.amap.com/v3";

interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  province: string;
  city: string;
}

export async function geocode(
  address: string,
  city?: string
): Promise<GeocodeResult | null> {
  if (!AMAP_API_KEY) return null;

  const params = new URLSearchParams({
    key: AMAP_API_KEY,
    address,
    output: "JSON",
  });
  if (city) params.set("city", city);

  try {
    const res = await fetch(
      `${AMAP_BASE}/geocode/geo?${params.toString()}`
    );
    const data = await res.json();
    if (data.status !== "1" || !data.geocodes?.length) return null;

    const geo = data.geocodes[0];
    const [lng, lat] = geo.location.split(",").map(Number);
    return {
      lat,
      lng,
      formattedAddress: geo.formatted_address || address,
      province: geo.province || "",
      city: geo.city || "",
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  if (!AMAP_API_KEY) return null;

  const location = `${lng},${lat}`;
  const params = new URLSearchParams({
    key: AMAP_API_KEY,
    location,
    output: "JSON",
  });

  try {
    const res = await fetch(
      `${AMAP_BASE}/geocode/regeo?${params.toString()}`
    );
    const data = await res.json();
    if (data.status !== "1" || !data.regeocode) return null;
    return data.regeocode.formatted_address || null;
  } catch {
    return null;
  }
}

interface POIItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}

export async function poiSearch(
  keywords: string,
  city?: string,
  types?: string
): Promise<POIItem[]> {
  if (!AMAP_API_KEY) return [];

  const params = new URLSearchParams({
    key: AMAP_API_KEY,
    keywords,
    output: "JSON",
    offset: "10",
    extensions: "base",
  });
  if (city) params.set("city", city);
  if (types) params.set("types", types);

  try {
    const res = await fetch(
      `${AMAP_BASE}/place/text?${params.toString()}`
    );
    const data = await res.json();
    if (data.status !== "1" || !data.pois?.length) return [];

    return data.pois.map(
      (poi: { id: string; name: string; address: string; location: string; type: string }) => {
        const [lng, lat] = poi.location.split(",").map(Number);
        return {
          id: poi.id,
          name: poi.name,
          address: poi.address || "",
          lat,
          lng,
          type: poi.type || "",
        };
      }
    );
  } catch {
    return [];
  }
}

export async function autoGeocodeInBackground(
  address: string,
  city?: string
): Promise<{ lat: number; lng: number } | null> {
  const result = await geocode(address, city);
  return result ? { lat: result.lat, lng: result.lng } : null;
}

/**
 * 通过 POI ID 获取 POI 详情
 */
export async function getPoiDetail(
  id: string
): Promise<POIItem | null> {
  if (!AMAP_API_KEY) return null;

  const params = new URLSearchParams({
    key: AMAP_API_KEY,
    id,
    output: "JSON",
    extensions: "all",
  });

  try {
    const res = await fetch(
      `${AMAP_BASE}/place/detail?${params.toString()}`
    );
    const data = await res.json();
    if (data.status !== "1" || !data.pois?.length) return null;

    const poi = data.pois[0];
    const [lng, lat] = poi.location.split(",").map(Number);
    return {
      id: poi.id,
      name: poi.name,
      address: poi.address || "",
      lat,
      lng,
      type: poi.type || "",
    };
  } catch {
    return null;
  }
}

/**
 * 周边搜索：根据经纬度和类型搜索附近 POI
 */
export async function nearbyPoiSearch(
  lat: number,
  lng: number,
  types: string,
  radius: number = 1000,
  offset: number = 10
): Promise<POIItem[]> {
  if (!AMAP_API_KEY) return [];

  const params = new URLSearchParams({
    key: AMAP_API_KEY,
    location: `${lng},${lat}`,
    types,
    radius: String(radius),
    output: "JSON",
    offset: String(offset),
    extensions: "base",
  });

  try {
    const res = await fetch(
      `${AMAP_BASE}/place/around?${params.toString()}`
    );
    const data = await res.json();
    if (data.status !== "1" || !data.pois?.length) return [];

    return data.pois.map(
      (poi: { id: string; name: string; address: string; location: string; type: string }) => {
        const [lng, lat] = poi.location.split(",").map(Number);
        return {
          id: poi.id,
          name: poi.name,
          address: poi.address || "",
          lat,
          lng,
          type: poi.type || "",
        };
      }
    );
  } catch {
    return [];
  }
}
