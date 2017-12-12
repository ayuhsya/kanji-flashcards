import json
import urllib
import urllib.parse
import urllib.request
from pprint import pprint


data=json.load(open('kanji.json'))

pretty_data=[]

#print (data)

for entry in data:
	query={
		'kanji': entry[1][u'content'],
		'kunyomi': entry[2][u'content'],
		'onyomi': entry[3][u'content'],
		'meaning': entry[4][u'content']
	}
	
	pretty_data.append(query)

with open('kanji_parsed.json', 'w') as outfile:
    json.dump(pretty_data, outfile, ensure_ascii=False)