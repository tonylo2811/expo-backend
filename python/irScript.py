#run model, output class name
import sys, shutil
from ultralytics import YOLO

model = YOLO('./python/bestv4-t6.pt')
imgPath = sys.argv[1]
model.predict(imgPath, save_txt=True)

# move the following to node server post controller
# read the output text file
with open("./runs/detect/predict/labels/img.txt", "r") as reader:
    lines = reader.readlines()
    for n,line in enumerate(lines):
        print(line.split(" ")[0])
        
# delete the output directory ./runs/detect/predict
shutil.rmtree("./runs/detect/")
