from flask import Flask, render_template
import requests
import requests_cache
import time
import json

app = Flask(__name__, template_folder='templates')

# caches requested data
requests_cache.install_cache('aid.gov_cache', backend='sqlite')

# default route
@app.route("/")
def main():
    return render_template('test.html')

# redirect (e.g. http://localhost:5000/map)
@app.route("/map")
def map():
    data = get_clinc_locations(47.606, -122.332, 10)
    print(json.dumps(data, indent=4, sort_keys=True))
    return render_template('view.html')

def get_clinc_locations(lat, lon, dist):
    """ request clinic data from aids.gov w/ given latitutde, longitude and distance """
    # round to 3 decimal places
    lat = round(lat, 3)
    lon = round(lon, 3)
    url = "https://locator.aids.gov/data?lat={}&long={}&distance={}".format(lat, lon, dist)

    start_time = time.time()
    print ("getting clinic locations...")
    res = requests.get(url, stream=True, allow_redirects=False)
    print('res1 complete')
    print("--- %s seconds ---" % (time.time() - start_time))

    data = res.json()
    return data


if __name__ == "__main__":
    # detailed log files on errors
    app.debug = True
    app.run()
