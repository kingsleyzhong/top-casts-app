from fastapi import FastAPI

# from google.cloud import storage, firestore
import datetime
import random
from pydantic import BaseModel

# from . import search
from fastapi.staticfiles import StaticFiles
from fastapi import APIRouter, HTTPException
import marqo

app = FastAPI()


# db = firestore.Client(project="top-casts")
# imgs = db.collection("images")

# bucket = storage.Client(project="top-casts").bucket("top-casts-images")
# tmp = [img for i, img in enumerate(imgs.stream()) if i < 100_000]
# random.shuffle(tmp)

# pt = 0

# output_cache = {}

# app.include_router(search.router)
# app.mount("/api/static", StaticFiles(directory="K:/collection"), name="static")


mq = marqo.Client(url="http://search.top-casts.com")
index = mq.index("top-casts-structured")


# @router.get("/api/search/v1")
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


@app.get("/api/search")
def search(
    query: str = "Random cast images",
    themes: str = None,
    negs: str = None,
    offset: int = 0,
    limit: int = 20,
    lower_rating: float = 0,
    upper_rating: float = 5,
):

    # if len(rating_range) not in (0, 2):
    #     raise HTTPException(status_code=403, detail="Range should be 2 values")

    query_weights = {query: 1.0}
    if themes:
        query_weights[themes] = 0.75
    if negs:
        query_weights[negs] = -1.1

    # print(query_weights, lower_rating, upper_rating)
    # print(rating_range)
    # print(f"rating:[{rating_range[0]} TO {rating_range[1]}]" if rating_range else None)

    results = index.search(
        query_weights,
        offset=offset,
        limit=limit,
        device="cuda",
        filter_string=(f"rating:[{lower_rating} TO {upper_rating}]"),
    )

    res = results["hits"]
    BASE_URL = "https://assets.top-casts.com/raw_images/"
    for item in res:
        item["src"] = BASE_URL + item["_id"] + "." + item["image"].split(".")[-1]

    # return [
    #     BASE_URL + res["_id"] + "." + res["image"].split(".")[-1]
    #     for res in results["hits"]
    # ]
    return res


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


# def get_item(index):
#     entry = tmp[index]
#     id = entry.id

#     filename = f"raw/{entry.id}{entry.get('suffix')}"
#     blob = bucket.blob(filename)

#     if id in output_cache:
#         return output_cache[id]

#     output = {
#         "rating": tmp[index].get("rating"),
#         "src": blob.generate_signed_url(
#             version="v4",
#             expiration=datetime.timedelta(hours=24),
#             method="GET",
#         ),
#     }

#     output_cache[id] = output
#     return output


# def get_image(diff: int):
#     global pt
#     output = get_item(pt)
#     pt = pt + diff
#     return output


# class ImageRequest(BaseModel):
#     rating: int | None = None
#     count: int = 25
#     start: int = 0


# @app.get("/api/image/list")
# def get_image_list(rating: int = None, count: int = 25, start: int = 0):
#     # rating = request.rating
#     # count = request.count
#     # start = request.start

#     ret = []

#     for i in range(start, start + count):
#         ret.append(get_item(i))

#     return ret


# @app.get("/api/image/next")
# def get_next_image():
#     return get_image(1)


# @app.get("/api/image/prev")
# def get_prev_image():
#     return get_image(-1)


# @app.get("/api/image/shuffle")
# def shuffle():
#     global pt
#     random.shuffle(tmp)
#     pt = 0
#     output_cache.clear()
#     return {"message": "Shuffled"}


@app.get("/")
def read_root():
    return {"Hello": "World"}
