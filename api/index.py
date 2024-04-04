from fastapi import FastAPI
from google.cloud import storage, firestore
import datetime
import random
from pydantic import BaseModel
from . import search
from fastapi.staticfiles import StaticFiles

app = FastAPI()


db = firestore.Client(project="top-casts")
imgs = db.collection("images")

bucket = storage.Client(project="top-casts").bucket("top-casts-images")
tmp = [img for i, img in enumerate(imgs.stream()) if i < 100_000]
random.shuffle(tmp)

pt = 0

output_cache = {}

app.include_router(search.router)
app.mount("/api/static", StaticFiles(directory="K:/collection"), name="static")


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


def get_item(index):
    entry = tmp[index]
    id = entry.id

    filename = f"raw/{entry.id}{entry.get('suffix')}"
    blob = bucket.blob(filename)

    if id in output_cache:
        return output_cache[id]

    output = {
        "rating": tmp[index].get("rating"),
        "src": blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(hours=24),
            method="GET",
        ),
    }

    output_cache[id] = output
    return output


def get_image(diff: int):
    global pt
    output = get_item(pt)
    pt = pt + diff
    return output


class ImageRequest(BaseModel):
    rating: int | None = None
    count: int = 25
    start: int = 0


@app.get("/api/image/list")
def get_image_list(rating: int = None, count: int = 25, start: int = 0):
    # rating = request.rating
    # count = request.count
    # start = request.start

    ret = []

    for i in range(start, start + count):
        ret.append(get_item(i))

    return ret


@app.get("/api/image/next")
def get_next_image():
    return get_image(1)


@app.get("/api/image/prev")
def get_prev_image():
    return get_image(-1)


@app.get("/api/image/shuffle")
def shuffle():
    global pt
    random.shuffle(tmp)
    pt = 0
    output_cache.clear()
    return {"message": "Shuffled"}


@app.get("/")
def read_root():
    return {"Hello": "World"}
