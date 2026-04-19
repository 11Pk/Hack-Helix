# from fastapi import FastAPI
# from pydantic import BaseModel
# import requests
# import urllib.parse
# import os
# import math
# from dotenv import load_dotenv
# from fastapi.middleware.cors import CORSMiddleware

# load_dotenv()

# app = FastAPI()

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# API_KEY = os.getenv("OPENCAGE_API_KEY")

# # ---------- MODELS ----------
# class RouteRequest(BaseModel):
#     rider: str
#     stops: list

# # ---------- HELPERS ----------
# def geocode(address):
#     encoded = urllib.parse.quote(address + ", India")
#     url = f"https://api.opencagedata.com/geocode/v1/json?q={encoded}&key={API_KEY}"
#     res = requests.get(url).json()

#     if not res.get("results"):
#         return None

#     return res["results"][0]["geometry"]

# def distance(lat1, lon1, lat2, lon2):
#     R = 6371
#     lat1, lon1 = math.radians(lat1), math.radians(lon1)
#     lat2, lon2 = math.radians(lat2), math.radians(lon2)

#     dlat = lat2 - lat1
#     dlon = lon2 - lon1

#     a = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
#     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

#     return R * c

# # ---------- DP ----------
# def solve_tsp(dist):
#     n = len(dist)
#     FULL = 1 << n

#     dp = [[float("inf")] * n for _ in range(FULL)]
#     parent = [[-1] * n for _ in range(FULL)]

#     dp[1][0] = 0

#     for mask in range(1, FULL):
#         for u in range(n):
#             if not (mask & (1 << u)):
#                 continue

#             for v in range(n):
#                 if mask & (1 << v):
#                     continue

#                 newMask = mask | (1 << v)
#                 cost = dist[u][v]

#                 if dp[mask][u] + cost < dp[newMask][v]:
#                     dp[newMask][v] = dp[mask][u] + cost
#                     parent[newMask][v] = u

#     finalMask = FULL - 1
#     last = min(range(n), key=lambda i: dp[finalMask][i])

#     route = []
#     mask = finalMask

#     while last != -1:
#         route.append(last)
#         prev = parent[mask][last]
#         mask ^= (1 << last)
#         last = prev

#     return route[::-1]

# # ---------- MAIN API ----------

# def optimize_route(data: RouteRequest):

#     locations = [data.rider] + data.stops

#     coords = []
#     for loc in locations:
#         geo = geocode(loc)
#         if not geo:
#             return {"error": f"Failed to geocode {loc}"}
#         coords.append((geo["lat"], geo["lng"]))

#     n = len(coords)

#     # build matrix
#     matrix = [[0]*n for _ in range(n)]

#     for i in range(n):
#         for j in range(n):
#             if i == j:
#                 continue
#             matrix[i][j] = distance(
#                 coords[i][0], coords[i][1],
#                 coords[j][0], coords[j][1]
#             )

#     route = solve_tsp(matrix)

#     return {
#         "route": route,
#         "matrix": matrix,
#         "coordinates": [
#             {"lat": coords[i][0], "lng": coords[i][1]} for i in range(n)
#         ],
#     }

from fastapi import FastAPI
from pydantic import BaseModel
import requests
import urllib.parse
import os
import math
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("OPENCAGE_API_KEY")

# ---------- MODELS ----------
class RouteRequest(BaseModel):
    rider: str
    stops: list

# ---------- HELPERS ----------
def geocode(address):
    encoded = urllib.parse.quote(address + ", India")
    url = f"https://api.opencagedata.com/geocode/v1/json?q={encoded}&key={API_KEY}"
    res = requests.get(url).json()

    if not res.get("results"):
        return None

    return res["results"][0]["geometry"]

def distance(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1 = math.radians(lat1), math.radians(lon1)
    lat2, lon2 = math.radians(lat2), math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c

# ---------- DP ----------
def solve_tsp(dist):
    n = len(dist)
    FULL = 1 << n

    dp = [[float("inf")] * n for _ in range(FULL)]
    parent = [[-1] * n for _ in range(FULL)]

    dp[1][0] = 0

    for mask in range(1, FULL):
        for u in range(n):
            if not (mask & (1 << u)):
                continue

            for v in range(n):
                if mask & (1 << v):
                    continue

                newMask = mask | (1 << v)
                cost = dist[u][v]

                if dp[mask][u] + cost < dp[newMask][v]:
                    dp[newMask][v] = dp[mask][u] + cost
                    parent[newMask][v] = u

    finalMask = FULL - 1
    last = min(range(n), key=lambda i: dp[finalMask][i])

    route = []
    mask = finalMask

    while last != -1:
        route.append(last)
        prev = parent[mask][last]
        mask ^= (1 << last)
        last = prev

    return route[::-1]

# ---------- MAIN API ----------

def optimize_route(data: RouteRequest):

    locations = [data.rider] + data.stops

    coords = []
    for loc in locations:
        geo = geocode(loc)
        if not geo:
            return {"error": f"Failed to geocode {loc}"}
        coords.append((geo["lat"], geo["lng"]))

    n = len(coords)

    # build matrix
    matrix = [[0]*n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            matrix[i][j] = distance(
                coords[i][0], coords[i][1],
                coords[j][0], coords[j][1]
            )

    route = solve_tsp(matrix)

    return {
        "route": route,
        "matrix": matrix,
        "coordinates": [
            {"lat": coords[i][0], "lng": coords[i][1]} for i in range(n)
        ],
    }