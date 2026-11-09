import type { GeoPoint } from '../types';

export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatAddress(address: string): string {
  const parts = address.split(' ');
  if (parts.length > 3) {
    return parts.slice(0, 3).join(' ') + '...';
  }
  return address;
}

export function getStaticMapUrl(location: GeoPoint, width = 300, height = 200): string {
  return `https://dapi.kakao.com/v2/maps/staticmap?center=${location.lng},${location.lat}&level=3&size=${width}x${height}&markers=${location.lng},${location.lat}`;
}

export function optimizeRoute(start: GeoPoint, destinations: GeoPoint[]): GeoPoint[] {
  if (destinations.length === 0) return [];
  
  const result: GeoPoint[] = [];
  let current = start;
  const remaining = [...destinations];
  
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let minDistance = calculateDistance(current, remaining[0]);
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(current, remaining[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }
    
    const nearest = remaining.splice(nearestIndex, 1)[0];
    result.push(nearest);
    current = nearest;
  }
  
  return result;
}
