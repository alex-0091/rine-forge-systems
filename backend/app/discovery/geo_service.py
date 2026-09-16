"""
Rine Forge Systems V5 - Business Geo-Targeting Service (Module 45)
Filters and prioritizes legitimate commercial opportunities within the client's service radius.
Guarantees zero tracking of individual private GPS locations.
"""
from typing import Dict, Any, List, Optional
import math

# Default approximate coordinates for key metropolitan reference centroids
CITY_CENTROIDS = {
    "austin": (30.2672, -97.7431),
    "round rock": (30.5083, -97.6789),
    "cedar park": (30.5052, -97.8203),
    "pflugerville": (30.4548, -97.6223),
    "georgetown": (30.6333, -97.6778),
    "west lake hills": (30.2913, -97.7961),
    "lakeway": (30.3635, -97.9797),
    "buda": (30.0847, -97.8439),
    "kyle": (29.9897, -97.8772),
    "san antonio": (29.4241, -98.4936),
    "dallas": (32.7767, -96.7970),
    "houston": (29.7604, -95.3698)
}

def haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two points on Earth in miles."""
    R = 3958.8 # Radius of Earth in miles
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2 +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

class BusinessGeoTargetingService:
    """
    Evaluates geographic relevance against client's configured service radius.
    """

    def evaluate_geo_fit(
        self,
        opportunity_location: Optional[str],
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates geographic fit percentage (0–100) and service area compliance.
        """
        service_area = config.get("service_area", "Austin Metro Area")
        allowed_cities = [c.lower() for c in config.get("cities", ["austin", "round rock", "cedar park", "west lake hills"])]
        allowed_neighborhoods = [n.lower() for n in config.get("neighborhoods", [])]
        radius_miles = float(config.get("radius_miles", 20.0))
        base_city = config.get("base_city", "austin").lower()
        base_coords = CITY_CENTROIDS.get(base_city, (30.2672, -97.7431))

        if not opportunity_location:
            # Neutral geographic score when location is unspecified
            return {
                "fit_score": 60,
                "distance_miles": None,
                "within_service_area": True,
                "service_area": service_area,
                "notes": "Location not explicitly stated; assuming standard metro eligibility."
            }

        loc_lower = opportunity_location.lower()

        # 1. Check direct neighborhood match
        for nh in allowed_neighborhoods:
            if nh in loc_lower:
                return {
                    "fit_score": 98,
                    "distance_miles": 3.0,
                    "within_service_area": True,
                    "service_area": service_area,
                    "matched_location": nh.title()
                }

        # 2. Check direct city match & distance
        for city in allowed_cities:
            if city in loc_lower:
                city_coords = CITY_CENTROIDS.get(city)
                if city_coords:
                    dist = haversine_miles(base_coords[0], base_coords[1], city_coords[0], city_coords[1])
                    within = dist <= radius_miles
                    fit = 95 if within else max(20, int(95 - (dist - radius_miles) * 3))
                    return {
                        "fit_score": fit,
                        "distance_miles": dist,
                        "within_service_area": within,
                        "service_area": service_area,
                        "matched_location": city.title()
                    }
                else:
                    return {
                        "fit_score": 90,
                        "distance_miles": 5.0,
                        "within_service_area": True,
                        "service_area": service_area,
                        "matched_location": city.title()
                    }

        # 3. Known external city calculation
        for ext_city, coords in CITY_CENTROIDS.items():
            if ext_city in loc_lower:
                dist = haversine_miles(base_coords[0], base_coords[1], coords[0], coords[1])
                within = dist <= radius_miles
                fit = max(10, int(95 - dist * 1.5))
                return {
                    "fit_score": fit,
                    "distance_miles": dist,
                    "within_service_area": within,
                    "service_area": service_area,
                    "matched_location": ext_city.title()
                }

        # Unrecognized location string
        return {
            "fit_score": 50,
            "distance_miles": None,
            "within_service_area": False,
            "service_area": service_area,
            "notes": f"Location '{opportunity_location}' outside core service area."
        }

    def match_location_to_metro(
        self,
        candidate_location: str,
        target_metro: str,
        max_radius_miles: float = 50.0
    ) -> tuple[bool, float]:
        """
        Determines whether candidate location falls within target metro radius.
        Returns (is_match: bool, distance_miles: float).
        """
        cand_lower = candidate_location.lower()
        metro_lower = target_metro.lower().split(",")[0].strip()

        # Direct string containment
        if metro_lower in cand_lower or cand_lower in metro_lower:
            return True, 0.0

        metro_coords = CITY_CENTROIDS.get(metro_lower, (30.2672, -97.7431))
        for city, coords in CITY_CENTROIDS.items():
            if city in cand_lower:
                dist = haversine_miles(metro_coords[0], metro_coords[1], coords[0], coords[1])
                return (dist <= max_radius_miles), dist

        # Fallback permissive match if state matches
        if ", tx" in cand_lower or "texas" in cand_lower:
            return True, 15.0

        return False, 999.0

geo_targeting_service = BusinessGeoTargetingService()
geo_service = geo_targeting_service

