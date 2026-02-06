# Configuration constants for Streamlit UI

# API Configuration
API_BASE_URL = "http://localhost:8000"
API_PROCESS_ENDPOINT = f"{API_BASE_URL}/process"
API_ALIAS_ADD_ENDPOINT = f"{API_BASE_URL}/api/alias/add"
API_ALIAS_DROP_ENDPOINT = f"{API_BASE_URL}/api/alias/drop"

# Page Configuration
PAGE_TITLE = "Swap Confirmation Processing"
PAGE_ICON = "📊"
PAGE_LAYOUT = "wide"

# Color Definitions for Row States
COLORS = {
    "green": {
        "background": "#d4edda",
        "text": "#155724",
        "border": "#c3e6cb"
    },
    "yellow": {
        "background": "#fff3cd",
        "text": "#856404",
        "border": "#ffeeba"
    },
    "red": {
        "background": "#f8d7da",
        "text": "#721c24",
        "border": "#f5c6cb"
    }
}

# File Upload Configuration
ALLOWED_BOOKING_EXTENSIONS = ["xlsx", "xls"]
ALLOWED_CONFIRMATION_EXTENSIONS = ["pdf"]

# Processing Configuration
API_TIMEOUT = 300  # 5 minutes for processing
