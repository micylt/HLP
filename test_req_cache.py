# this module is only used for testing request and request_cache functionalities
import requests
import requests_cache
import time
import json

requests_cache.install_cache('aid.gov_cache', backend='sqlite')

if __name__ == '__main__':
        url = "https://locator.aids.gov/data?lat=47.606&long=-122.332&distance=1"
        # making request before caching data
        start_time = time.time()
        res1 = requests.get(url, stream=True, allow_redirects=False)
        print('res1 complete')
        print("--- %s seconds ---" % (time.time() - start_time))

        # making request after caching data
        start_time = time.time()
        res2 = requests.get(url, stream=True, allow_redirects=False)
        print('res2 complete')
        print("--- %s seconds ---" % (time.time() - start_time))

        res1_json = res1.json()
        res2_json = res2.json()

        print(json.dumps(res2_json, indent=4, sort_keys=True))
