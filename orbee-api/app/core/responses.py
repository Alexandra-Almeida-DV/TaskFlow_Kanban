from typing import Any, Optional
from fastapi.responses import JSONResponse

def api_response(success: bool, data=None, message="", status_code=200):
    return {
        "success": success,
        "data": data,
        "message": message
    }