# from typing import List
from fastapi import APIRouter, HTTPException
import marqo


router = APIRouter()
handler = router

# PATH_BASE = "/api/static"
# mq = marqo.Client(url="http://search.top-casts.com")
# index = mq.index("top-casts-structured")


# @router.get(/"/api/search/v1")
# def search_v1(
#     query: str = "Random cast images",
#     themes: str = None,
#     negs: str = None,
#     offset: int = 0,
#     limit: int = 20,
# ):

#     if len(rating_range) not in (0, 2):
#         raise HTTPException(status_code=403, detail="Range should be 2 values")

#     query_weights = {query: 1.0}
#     if themes:
#         query_weights[themes] = 0.75
#     if negs:
#         query_weights[negs] = -1.1

#     results = index.search(
#         query_weights,
#         offset=offset,
#         limit=limit,
#         device="cuda",
#         filter_string=(
#             f"rating:[{rating_range[0]} TO {rating_range[1]}]" if rating_range else None
#         ),
#     )
#     return [PATH_BASE + res["image"][11:] for res in results["hits"]]


# @router.get("/api/search")
# def search(
#     query: str = "Random cast images",
#     themes: str = None,
#     negs: str = None,
#     offset: int = 0,
#     limit: int = 20,
#     lower_rating: float = 0,
#     upper_rating: float = 5,
# ):

#     # if len(rating_range) not in (0, 2):
#     #     raise HTTPException(status_code=403, detail="Range should be 2 values")

#     query_weights = {query: 1.0}
#     if themes:
#         query_weights[themes] = 0.75
#     if negs:
#         query_weights[negs] = -1.1

#     # print(query_weights, lower_rating, upper_rating)
#     # print(rating_range)
#     # print(f"rating:[{rating_range[0]} TO {rating_range[1]}]" if rating_range else None)

#     results = index.search(
#         query_weights,
#         offset=offset,
#         limit=limit,
#         device="cuda",
#         filter_string=(f"rating:[{lower_rating} TO {upper_rating}]"),
#     )

#     res = results["hits"]
#     BASE_URL = "https://assets.top-casts.com/raw_images/"
#     for item in res:
#         item["src"] = BASE_URL + item["_id"] + "." + item["image"].split(".")[-1]

#     # return [
#     #     BASE_URL + res["_id"] + "." + res["image"].split(".")[-1]
#     #     for res in results["hits"]
#     # ]
#     return res
