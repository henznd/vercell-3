import os
from datetime import datetime, timedelta, time

# Paramètres par défaut
MIN_DATE = datetime.now().date()
MAX_DATE = MIN_DATE + timedelta(days=60)
DEFAULT_START_TIME = time(6, 0)
DEFAULT_END_TIME = time(23, 0)
DEFAULT_ORIGIN = "PARIS"
MAX_RANGE_DAYS = 30
DEFAULT_RANGE_DAYS = 7

# API SNCF
SNCF_API_URL = os.getenv("SNCF_API_URL", "https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records")
API_LIMIT = int(os.getenv("API_LIMIT", 100))

# Cache Configuration
CACHE_TTL = 3600  # 1 hour in seconds 