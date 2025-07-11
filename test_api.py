import requests
import json
from datetime import datetime, timedelta

# URL Railway
BASE_URL = "https://vercell-3-production.up.railway.app"

def test_endpoint(endpoint, params=None):
    """Test un endpoint et affiche le résultat"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\n🔍 Test de: {url}")
    
    try:
        if params:
            response = requests.get(url, params=params)
        else:
            response = requests.get(url)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Succès: {data.get('message', 'OK')}")
            if 'count' in data:
                print(f"📈 Nombre de résultats: {data['count']}")
            if 'trips' in data and isinstance(data['trips'], list) and data['trips']:
                print(f"📝 Exemple de résultat: {json.dumps(data['trips'][:1], indent=2, ensure_ascii=False)}")
            elif 'trips' in data and isinstance(data['trips'], dict):
                depart = data['trips'].get('depart', [])
                retour = data['trips'].get('return', [])
                print(f"📝 Exemple aller: {json.dumps(depart[:1], indent=2, ensure_ascii=False)}")
                print(f"📝 Exemple retour: {json.dumps(retour[:1], indent=2, ensure_ascii=False)}")
            elif 'stations' in data and data['stations']:
                print(f"📝 Exemple de gares: {data['stations'][:5]}")
            else:
                print("📝 Aucun résultat trouvé")
        else:
            print(f"❌ Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def main():
    print("🚄 Test de l'API TGV Max")
    print("=" * 50)
    
    # Test endpoint racine
    test_endpoint("/")
    
    # Test stations
    test_endpoint("/api/stations")
    
    # Test trajets simples Paris-Lyon
    test_endpoint("/api/trains/single", {
        "date": "2025-07-16",
        "origin": "PARIS",
        "destination": "LYON",
        "start_time": "00:00",
        "end_time": "23:59"
    })
    
    # Test trajets aller-retour
    test_endpoint("/api/trains/round-trip", {
        "depart_date": "2025-07-16",
        "return_date": "2025-07-18",
        "origin": "PARIS",
        "destination": "LYON"
    })
    
    # Test plage de dates
    test_endpoint("/api/trains/range", {
        "start_date": "2025-07-16",
        "days": 3,
        "origin": "PARIS"
    })

if __name__ == "__main__":
    main() 