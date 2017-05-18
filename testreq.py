# script for requesting JSON formatted data from given URL
# *only* used for testing request functionality

import requests

def get(url):
    try:
        res = requests.get(url)
        return res.json()
    except Exception as ex:
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(ex).__name__, ex.args)
        print(message)

if __name__ == '__main__':
    url = "https://locator.aids.gov/data?lat=47.606&long=-122.332&distance=10"
    data = get(url)
    print (data)
