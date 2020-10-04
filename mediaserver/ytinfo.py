import youtube_dl
import sys
import json

ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': 'tmp/%(id)s.%(ext)s',
    'quiet': True,
    'prefer_ffmpeg': True,
    'audioformat': 'wav',
    #'forceduration': True
}
sID = sys.argv[1]
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    dictMeta = ydl.extract_info(
        "https://www.youtube.com/watch?v={sID}".format(sID=sID),
        download=False)
    print(json.dumps(dictMeta))
