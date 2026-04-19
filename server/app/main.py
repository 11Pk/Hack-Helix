import os
import sys

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from routes.predict import router as predict_router

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from optimize import optimize_route, RouteRequest as OptimizeRouteRequest

app = FastAPI(title="Hackathon Delivery AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)


class StopItem(BaseModel):
    """One delivery stop; same shape as the frontend list rows."""

    address: str
    customerId: Optional[str] = None
    time: Optional[str] = None


class RouteRequestIn(BaseModel):
    rider: str
    stops: Optional[list[str]] = None
    items: Optional[list[StopItem]] = None


@app.post("/optimize-route")
def post_optimize_route(body: RouteRequestIn):
    """
    Build the flat `stops` list for `optimize_route` from either:
    - `items`: full per-stop objects (preferred from the client), or
    - `stops`: list of address strings only (legacy).
    """
    if body.items:
        stop_addrs = [s.address for s in body.items]
    elif body.stops:
        stop_addrs = body.stops
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide `items` (list of { address, customerId?, time? }) or `stops` (list of strings).",
        )

    req = OptimizeRouteRequest(rider=body.rider, stops=stop_addrs)
    return optimize_route(req)