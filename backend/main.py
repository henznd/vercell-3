from fastapi import FastAPI, HTTPException, Query
from datetime import datetime, time
from typing import Optional
from api_utils import get_tgvmax_trains, filter_trains_by_time, format_single_trips

app = FastAPI()

@app.get("/")
def root():
    return {"message": "TGV Max API sur Railway!"}

@app.get("/api/trains/single")
def get_single_trips(
    date: str = Query(...),
    origin: str = Query(...),
    destination: Optional[str] = Query(None),
    start_time: str = Query("00:00"),
    end_time: str = Query("23:59")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 