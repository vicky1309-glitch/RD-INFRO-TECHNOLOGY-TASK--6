import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import ForecastCard from "../components/ForecastCard";
import WeatherChart from "../components/WeatherChart";
import AQICard from "../components/AQICard";
import UVIndexCard from "../components/UVIndexCard";
import MapComponent from "../components/MapComponent";
import WeatherAlerts from "../components/WeatherAlerts";
import FavoriteCities from "../components/FavoriteCities";
import ClothingRecommendation from "../components/ClothingRecommendation";
import EmptyState from "../components/EmptyState";
import { WeatherCardSkeleton, ForecastRowSkeleton, CardSkeleton } from "../components/LoadingSkeleton";
import useGeolocation from "../hooks/useGeolocation";
import {
  fetchCurrentWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchAirQuality,
  fetchOneCall,
  addRecentSearch,
} from "../redux/weatherSlice";
import { setAlerts, pushToast } from "../redux/notificationSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { current, forecast, airQuality, oneCall, loading, forecastLoading, error } = useSelector(
    (state) => state.weather
  );
  const { user } = useSelector((state) => state.auth);
  const { alerts } = useSelector((state) => state.notifications);
  const { coords, locate } = useGeolocation();

  const loadCity = useCallback(
    (city) => {
      dispatch(fetchCurrentWeather(city));
      dispatch(fetchForecast(city));
      dispatch(fetchAirQuality(city));
    },
    [dispatch]
  );

  // Initial load: default/pinned city, or ask for geolocation
  useEffect(() => {
    const initialCity = user?.defaultCity || "Chennai";
    loadCity(initialCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (coords) {
      dispatch(fetchWeatherByCoords(coords));
      dispatch(fetchOneCall(coords));
    }
  }, [coords, dispatch]);

  useEffect(() => {
    if (current?.coord) {
      dispatch(fetchOneCall({ lat: current.coord.lat, lon: current.coord.lon }));
    }
  }, [current?.coord, dispatch]);

  useEffect(() => {
    if (oneCall?.alerts) {
      dispatch(setAlerts(oneCall.alerts));
    } else {
      dispatch(setAlerts([]));
    }
  }, [oneCall, dispatch]);

  // Proactive rain / high-UV notifications
  useEffect(() => {
    if (forecast?.list?.[0]?.pop >= 0.6) {
      dispatch(pushToast({ type: "rain", message: "Rain expected soon — you might want an umbrella." }));
    }
    if (oneCall?.current?.uvi >= 8) {
      dispatch(pushToast({ type: "uv", message: "High UV index today — wear sunscreen." }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast?.list, oneCall?.current?.uvi]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Weatherly"}
          </h1>
          <p className="text-sm text-ink/60">Real-time weather, forecasts and analytics.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <SearchBar
            onSelectCity={(city) => {
              loadCity(city);
              dispatch(addRecentSearch(city));
            }}
          />
          <button onClick={locate} className="btn-secondary whitespace-nowrap !py-3 text-sm" title="Use current location">
            📍 My location
          </button>
        </div>
      </div>

      {error && (
        <EmptyState icon="🌦️" title="City not found" message={error} />
      )}

      {alerts?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <WeatherAlerts alerts={alerts} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {loading || !current ? <WeatherCardSkeleton /> : <WeatherCard weather={current} />}

          {forecastLoading || !forecast ? <ForecastRowSkeleton /> : <HourlyForecast forecast={forecast} />}

          {forecast ? <ForecastCard forecast={forecast} /> : <CardSkeleton />}

          {forecast ? <WeatherChart forecast={forecast} /> : <CardSkeleton />}

          {current && <ClothingRecommendation weather={current} />}

          {current?.coord && (
            <MapComponent lat={current.coord.lat} lon={current.coord.lon} cityName={current.name} />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <FavoriteCities
            currentCity={current?.name}
            currentCoords={current?.coord}
            onSelectCity={loadCity}
          />
          {airQuality ? <AQICard airQuality={airQuality} /> : <CardSkeleton />}
          <UVIndexCard oneCall={oneCall} />
        </div>
      </div>
    </div>
  );
}
