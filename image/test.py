from google_images_search import GoogleImagesSearch
import json
import pandas as pd
secrets = open('image/secrets.json')
secrets = json.load(secrets)

client = GoogleImagesSearch(secrets['API_KEY'],secrets['CSE_ID'])

df = pd.read_csv('data/names.csv')

_search_params = {
    'q': '',
    'num': 1,
    'fileType': 'jpg|jpeg|png'
}
count = 0
try:
    for index, row in df.iterrows():
        count +=1
        _search_params['q'] = row['INSTNM']
        client.search(search_params=_search_params)

        for i in client.results():
            row['IMG'] = i.url
            print(i.url)
except:
    print(f'Error occured on index {count}. Store this for next iteration')
    df.to_csv(path_or_buf='./image/names.csv')


