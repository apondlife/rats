cd StreamingAssets
for f in *.mov *.mp4
do
  ffmpeg -y -i $f -vf "select=eq(n\,0)" -q:v 3 ../Thumbs/$f.png
done
cd ..