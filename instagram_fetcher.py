import json
import sys
from instagrapi import Client

url = sys.argv[1]
username = sys.argv[2]
password = sys.argv[3]

cl = Client()
cl.login(username, password)

media_pk = cl.media_pk_from_url(url)
comments = cl.media_comments(media_pk, amount=0)

users = []
seen = set()

for comment in comments:
    user = '@' + comment.user.username
    if user.lower() not in seen:
        seen.add(user.lower())
        users.append(user)

print(json.dumps(users))
