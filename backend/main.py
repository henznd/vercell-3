from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, time, timedelta
from typing import Optional
from api_utils import get_tgvmax_trains, filter_trains_by_time, format_single_trips
from config import MAX_RANGE_DAYS

app = FastAPI()

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez vos domaines exacts
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "TGV Max API sur Railway!", "version": "1.0.0"}

@app.get("/api/trains/single")
def get_single_trips(
    date: str = Query(..., description="Date au format YYYY-MM-DD"),
    origin: str = Query(..., description="Gare de départ"),
    destination: Optional[str] = Query(None, description="Gare de destination"),
    start_time: str = Query("00:00", description="Heure de début (HH:MM)"),
    end_time: str = Query("23:59", description="Heure de fin (HH:MM)")
):
    try:
        depart_date = datetime.strptime(date, "%Y-%m-%d").date()
        start_t = datetime.strptime(start_time, "%H:%M").time()
        end_t = datetime.strptime(end_time, "%H:%M").time()
        trains_df = get_tgvmax_trains(depart_date)
        if trains_df.empty:
            return {"message": "Aucun trajet trouvé pour cette date", "trips": []}
        if origin:
            trains_df = trains_df[trains_df['origine'].str.contains(origin.upper(), na=False)]
        if destination:
            trains_df = trains_df[trains_df['destination'].str.contains(destination.upper(), na=False)]
        trains_df = filter_trains_by_time(trains_df, start_t, end_t)
        if trains_df.empty:
            return {"message": "Aucun trajet trouvé pour les critères spécifiés", "trips": []}
        trips = format_single_trips(trains_df)
        return {"message": f"Trajets trouvés pour {origin} le {date}", "count": len(trips), "trips": trips}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la recherche: {str(e)}")

@app.get("/api/trains/round-trip")
def get_round_trips(
    depart_date: str = Query(..., description="Date de départ (YYYY-MM-DD)"),
    return_date: str = Query(..., description="Date de retour (YYYY-MM-DD)"),
    origin: str = Query(..., description="Gare de départ"),
    destination: Optional[str] = Query(None, description="Gare de destination"),
    depart_start_time: str = Query("00:00", description="Heure de début départ (HH:MM)"),
    depart_end_time: str = Query("23:59", description="Heure de fin départ (HH:MM)"),
    return_start_time: str = Query("00:00", description="Heure de début retour (HH:MM)"),
    return_end_time: str = Query("23:59", description="Heure de fin retour (HH:MM)")
):
    try:
        depart_dt = datetime.strptime(depart_date, "%Y-%m-%d").date()
        return_dt = datetime.strptime(return_date, "%Y-%m-%d").date()
        depart_start = datetime.strptime(depart_start_time, "%H:%M").time()
        depart_end = datetime.strptime(depart_end_time, "%H:%M").time()
        return_start = datetime.strptime(return_start_time, "%H:%M").time()
        return_end = datetime.strptime(return_end_time, "%H:%M").time()
        depart_trains = get_tgvmax_trains(depart_dt)
        return_trains = get_tgvmax_trains(return_dt)
        if depart_trains.empty and return_trains.empty:
            return {"message": "Aucun trajet trouvé pour ces dates", "trips": {"depart": [], "return": []}}
        if not depart_trains.empty:
            depart_trains = depart_trains[depart_trains['origine'].str.contains(origin.upper(), na=False)]
            if destination:
                depart_trains = depart_trains[depart_trains['destination'].str.contains(destination.upper(), na=False)]
            depart_trains = filter_trains_by_time(depart_trains, depart_start, depart_end)
        if not return_trains.empty:
            if destination:
                return_trains = return_trains[return_trains['origine'].str.contains(destination.upper(), na=False)]
            return_trains = return_trains[return_trains['destination'].str.contains(origin.upper(), na=False)]
            return_trains = filter_trains_by_time(return_trains, return_start, return_end)
        depart_trips = format_single_trips(depart_trains) if not depart_trains.empty else []
        return_trips = format_single_trips(return_trains) if not return_trains.empty else []
        return {
            "message": f"Trajets aller-retour trouvés pour {origin}",
            "depart_date": depart_date,
            "return_date": return_date,
            "depart_count": len(depart_trips),
            "return_count": len(return_trips),
            "trips": {
                "depart": depart_trips,
                "return": return_trips
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la recherche: {str(e)}")

@app.get("/api/trains/range")
def get_date_range_trips(
    start_date: str = Query(..., description="Date de début (YYYY-MM-DD)"),
    days: int = Query(7, description="Nombre de jours à rechercher"),
    origin: str = Query(..., description="Gare de départ"),
    start_time: str = Query("00:00", description="Heure de début (HH:MM)"),
    end_time: str = Query("23:59", description="Heure de fin (HH:MM)")
):
    try:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        start_t = datetime.strptime(start_time, "%H:%M").time()
        end_t = datetime.strptime(end_time, "%H:%M").time()
        if days > MAX_RANGE_DAYS:
            days = MAX_RANGE_DAYS
        all_trips = []
        for i in range(days):
            current_date = start_dt + timedelta(days=i)
            trains_df = get_tgvmax_trains(current_date)
            if not trains_df.empty:
                trains_df = trains_df[trains_df['origine'].str.contains(origin.upper(), na=False)]
                trains_df = filter_trains_by_time(trains_df, start_t, end_t)
                if not trains_df.empty:
                    trips = format_single_trips(trains_df)
                    for trip in trips:
                        trip['date'] = current_date.strftime("%Y-%m-%d")
                    all_trips.extend(trips)
        return {
            "message": f"Trajets trouvés pour {origin} sur {days} jours",
            "start_date": start_date,
            "days": days,
            "count": len(all_trips),
            "trips": all_trips
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la recherche: {str(e)}")

@app.get("/api/stations")
def get_stations():
    try:
        recent_date = datetime.now().date()
        trains_df = get_tgvmax_trains(recent_date)
        if trains_df.empty:
            return {"message": "Aucune donnée disponible", "stations": []}
        origins = trains_df['origine'].dropna().unique().tolist()
        destinations = trains_df['destination'].dropna().unique().tolist()
        all_stations = list(set(origins + destinations))
        all_stations.sort()
        return {
            "message": "Liste des gares disponibles",
            "count": len(all_stations),
            "stations": all_stations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des gares: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 