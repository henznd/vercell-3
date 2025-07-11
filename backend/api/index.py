from fastapi import FastAPI, HTTPException, Query
from datetime import datetime, timedelta, time
from typing import List, Dict, Union, Optional
from enum import Enum
import pandas as pd
import requests
import os
from mangum import Mangum

# Import direct des modules dans le même dossier
import api_utils
import config

app = FastAPI()

class SearchMode(str, Enum):
    SINGLE = "single"
    ROUND_TRIP = "round-trip"
    DATE_RANGE = "date-range"

@app.get("/")
def root():
    return {"message": "TGV Max API sur Vercel", "version": "1.0.0"}

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
        trains_df = api_utils.get_tgvmax_trains(depart_date)
        if trains_df.empty:
            return {"message": "Aucun trajet trouvé pour cette date", "trips": []}
        if origin:
            trains_df = trains_df[trains_df['origine'].str.contains(origin.upper(), na=False)]
        if destination:
            trains_df = trains_df[trains_df['destination'].str.contains(destination.upper(), na=False)]
        trains_df = api_utils.filter_trains_by_time(trains_df, start_t, end_t)
        if trains_df.empty:
            return {"message": "Aucun trajet trouvé pour les critères spécifiés", "trips": []}
        trips = api_utils.format_single_trips(trains_df)
        return {"message": f"Trajets trouvés pour {origin} le {date}", "count": len(trips), "trips": trips}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la recherche: {str(e)}")

# Ajoute ici les autres endpoints principaux si besoin...

handler = Mangum(app) 