import os
import httpx
from datetime import datetime, timezone
from typing import Optional

class WeatherClient:
    def __init__(self, api_key: Optional[str]):
        self.api_key = api_key
        self.geocode_url = "http://api.openweathermap.org/geo/1.0/direct"
        self.onecall_url = "https://api.openweathermap.org/data/2.5/onecall"

    async def geocode(self, city: str):
        params = {"q": city, "limit": 1, "appid": self.api_key}
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(self.geocode_url, params=params)
            r.raise_for_status()
            data = r.json()
            if not data:
                raise ValueError(f"City not found: {city}")
            return data[0]["lat"], data[0]["lon"]

    async def get_onecall(self, lat: float, lon: float):
        params = {"lat": lat, "lon": lon, "exclude": "minutely,alerts", "units": "metric", "appid": self.api_key}
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(self.onecall_url, params=params)
            r.raise_for_status()
            return r.json()

    async def get_precip_probability_for_date(self, city: str, date_iso: str):
        try:
            target_date = datetime.fromisoformat(date_iso).date()
        except Exception:
            raise ValueError("Invalid date format. Use YYYY-MM-DD")

        lat, lon = await self.geocode(city)
        data = await self.get_onecall(lat, lon)

        daily = data.get("daily", [])
        for day in daily:
            dt = datetime.fromtimestamp(day["dt"], tz=timezone.utc).date()
            if dt == target_date:
                pop = day.get("pop", 0.0)
                rain = day.get("rain", 0)
                snow = day.get("snow", 0)
                return self._format_response(city, target_date, pop, rain, snow, source="daily")

        hourly = data.get("hourly", [])
        pops = []
        for hour in hourly:
            dt = datetime.fromtimestamp(hour["dt"], tz=timezone.utc).date()
            if dt == target_date:
                pops.append(hour.get("pop", 0.0))
        if pops:
            pop = max(pops)
            return self._format_response(city, target_date, pop, None, None, source="hourly")

        raise ValueError("Requested date is outside available forecast range (OpenWeatherMap provides up to 7 days).")

    def _format_response(self, city, date_obj, pop, rain, snow, source="daily"):
        pop_pct = round(float(pop) * 100, 1)
        if pop_pct >= 60:
            risk = "High"
        elif pop_pct >= 30:
            risk = "Medium"
        else:
            risk = "Low"
        advice = "Take an umbrella." if risk in ("Medium","High") else "You probably won't need an umbrella."
        return {
            "city": city,
            "date": date_obj.isoformat(),
            "pop": pop_pct,
            "risk": risk,
            "advice": advice,
            "source": source,
            "raw": {"rain": rain, "snow": snow}
        }
