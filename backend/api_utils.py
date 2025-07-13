import pandas as pd
import requests
from datetime import datetime, time
from typing import List, Dict, Union
from config import SNCF_API_URL, API_LIMIT

def get_tgvmax_trains(date: datetime.date) -> pd.DataFrame:
    """Récupère les trains TGV Max pour une date donnée depuis l'API SNCF."""
    params = {
        "limit": API_LIMIT
    }
    response = requests.get(SNCF_API_URL, params=params)
    response.raise_for_status()
    data = response.json()
    records = data.get("results", [])
    df = pd.DataFrame(records)
    
    # Filtrage côté backend car l'API SNCF ne filtre pas correctement
    if not df.empty:
        target_date = date.strftime('%Y-%m-%d')
        df = df[df['date'] == target_date]
        print(f"[API_UTILS] Date demandée: {target_date}")
        print(f"[API_UTILS] Trains filtrés: {len(df)} sur {len(records)} reçus")
    
    return df

def filter_trains_by_time(df: pd.DataFrame, start: time, end: time) -> pd.DataFrame:
    """Filtre les trains selon un créneau horaire."""
    if df.empty:
        return df
    df["heure_depart"] = pd.to_datetime(df["heure_depart"])
    mask = (df["heure_depart"].dt.time >= start) & (df["heure_depart"].dt.time <= end)
    return df[mask]

def format_single_trips(df: pd.DataFrame) -> List[Dict]:
    """Formate les résultats pour l'affichage ou l'API."""
    return df.to_dict(orient="records")

def calculate_duration(row) -> str:
    """Calcule la durée d'un trajet."""
    try:
        dep = pd.to_datetime(row["heure_depart"])
        arr = pd.to_datetime(row["heure_arrivee"])
        duration = arr - dep
        return str(duration)
    except Exception:
        return "-"

def handle_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return {"error": str(e)}
    return wrapper 
