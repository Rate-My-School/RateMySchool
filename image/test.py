
from google_images_search import GoogleImagesSearch
import json
import pandas as pd
import os
secrets = open('image/secrets.json')
secrets = json.load(secrets)

client = GoogleImagesSearch(secrets['API_KEY'],secrets['CSE_ID'])

currentNames = pd.read_csv('./data/NYschools.txt')
removeNames = pd.read_csv('image/seen_lines.txt')
currentNames = pd.concat([currentNames,removeNames],ignore_index=True).drop_duplicates(keep=False).reset_index(drop=True)
#These three lines open both the seen and names to run text files. Then drop both if they are
# ran already


_search_params = {
    'q': '',
    'num': 1,
    'fileType': 'jpg|jpeg|png'
}

imgToNameDF = pd.DataFrame(columns=['title','image'])
count = 0
try:
    for index, name in currentNames.iterrows():
        count +=1
        print(name['title'])
        _search_params['q'] = f'{name["title"]} campus'
        client.search(search_params=_search_params)

        for i in client.results():
            removeNames.loc[len(removeNames.index)+1] = [name['title']]
            imgToNameDF.loc[len(imgToNameDF.index)+1] = [name['title'],i.url]
            print(i.url)

except KeyboardInterrupt: 
    print(f'Keyboard Interrupt')
    removeNames.to_csv(path_or_buf='image/seen_lines.txt', mode='a', index=False, header=False)
    imgToNameDF.to_csv(path_or_buf='image/names.csv', mode='a', index=False, header=False)
except: 
    print(f'Rate Limited')
    removeNames.to_csv(path_or_buf='image/seen_lines.txt', mode='a', index=False, header=False)
    imgToNameDF.to_csv(path_or_buf='image/names.csv', mode='a', index=False, header=False)



