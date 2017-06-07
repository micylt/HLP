#!/usr/local/bin/python3
""" HLP Flask Server """
from flask import Flask, render_template, request, redirect, Response, jsonify
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
    return render_template('view.html')


@app.route("/contacts")
def contacts():
    return render_template('contacts.html')


def get_clinic_locations(lat, lng, dist):
    """ request clinic data from aids.gov w/ given latitude, longitude and distance """
    lat = round(lat, 3)
    lng = round(lng, 3)
    url = "https://locator.aids.gov/data?lat={}&long={}&distance={}".format(lat, lng, dist)
    sleep = True

    start_time = time.time()
    print("getting clinic locations...")
    while sleep:
        try:
            res = requests.get(url, stream=True, allow_redirects=True)
            sleep = False
        except:
            print("connection refused by aids.gov server...")
            print("retrying after sleeep...")
            time.sleep(5)
            sleep = True
            continue

    print('response complete')
    print("--- %s seconds ---" % (time.time() - start_time))

    try:
        data = res.json()
    except Exception as ex:
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(ex).__name__, ex.args)
        print(message)
    return data


@app.route('/receiver', methods=['POST'])
def worker():
    # read json + reply
    res = request.get_json()
    if res:
        data = get_clinic_locations(res['lat'], res['lng'], res['dist'])
        return jsonify(data)

    return 'error'

if __name__ == "__main__":
    # detailed log files on errors
    app.debug = True
    app.run()
