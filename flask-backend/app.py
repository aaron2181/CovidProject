# import os
# from flask import Flask, render_template, request
# from keras.applications.resnet50 import ResNet50
# from keras.applications.vgg16 import VGG16
# from keras.preprocessing import image
# from keras.applications.resnet50 import preprocess_input, decode_predictions
# from keras.applications.vgg19 import VGG19
# from keras.models import Sequential, load_model
# from PIL import Image
# from watson_machine_learning_client import WatsonMachineLearningAPIClient
# import numpy as np
# from flask import jsonify

# app = Flask(__name__)

# UPLOAD_FOLDER = os.path.basename('uploads')

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# model = load_model('./model/train_model.h5')

# creds = {
#     "apikey": "RmlUN8hQDfcnJqmU1FlJFUnOjS2sVxIxnuzzm2LS-8td",
#     "iam_apikey_description": "Auto-generated for key 8a077c07-a81f-43c2-9026-e2d7919a4037",
#     "iam_apikey_name": "Service credentials-1",
#     "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Writer",
#     "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/c1c3c0533ace4b1eba3de3385814b16a::serviceid:ServiceId-3d9e4e75-27c0-4ec4-970b-296f281301ba",
#     "instance_id": "3ff93f38-ea5a-499e-8121-9456dbb863a7",
#     "password": "0f0d6874-c586-4afa-b542-6a242eab56ce",
#     "url": "https://us-south.ml.cloud.ibm.com",
#     "username": "8a077c07-a81f-43c2-9026-e2d7919a4037"
# }

# client = WatsonMachineLearningAPIClient(creds)

# scoring_url = 'https://us-south.ml.cloud.ibm.com/v3/wml_instances/3ff93f38-ea5a-499e-8121-9456dbb863a7/published_models/93f0e6bf-5509-4de3-bb3d-dd31a04d0a52/deployments/11ff212e-2bcb-4101-bb8a-0d736e56ebc9/online'
# # print('scoring URL')
# # scoring_payload = {'values': image.tolist()}
# # predictions = client.deployments.score(scoring_url, scoring_payload)
# # print(predictions)

# model._make_predict_function()
# print('model loaded')

# @app.route('/')
# def my_index():
#     return '';

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     print("Line 33 ======")
#     file = request.files['image']
#     filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#     file.save(filename)

#     return jsonify(file.filename)

# @app.route('/predict', methods=['GET'])
# def get_file():

#     usfileNameername = request.args.get('fileName')
#     filepath = './uploads/' + usfileNameername

#     img = Image.open(filepath)

#     img = img.resize((64,64))
#     img = np.array(img)
#     img = img / 255.0
#     img = img.reshape(1,64,64,3)
#     # preds = model.predict(img)
#     print('scoring URL')
#     scoring_payload = {'values': img.tolist()}
#     predictions = client.deployments.score(scoring_url, scoring_payload)
#     print('Predictions', predictions)

#     # print('Predicted: ', preds)

#     result = []
#     print (predictions["values"][0][0])
#     if predictions["values"][0][0]>0.5:
#         diag = "Malaria"
#         confidence = predictions["values"][0][0]
#     else:
#         diag = "Not Malaria"
#         confidence = predictions["values"][0][0]
#     return jsonify({"diagnosis":diag,"confidence":str(confidence)})
#     return predictions


# if __name__ == "__main__":
#     app.run()

#import boto3
import os
#from botocore.client import Config
ACCESS_KEY_ID = 'AKIAVRPLNQRJKSPR73AT'
ACCESS_SECRET_KEY = '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'
BUCKET_NAME = 'advancers.ai'

data = open("./uploads/nonInfected.png", 'rb')
print ("====Line 100=====")

#s3 = boto3.resource(
#    's3',
#    aws_access_key_id=ACCESS_KEY_ID,
#    aws_secret_access_key=ACCESS_SECRET_KEY,
#    config=Config(signature_version='s3v4')
#)
#s3.Bucket(BUCKET_NAME).put_object(Key="nonInfected.png", Body=data)


import boto3, botocore, tensorflow
from flask import Flask, render_template, request, send_from_directory
from keras.applications.resnet50 import ResNet50
from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input, decode_predictions
from keras.applications.vgg19 import VGG19
# from keras.models import Sequential, load_model
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from flask import jsonify
import cv2

template_dir = os.path.abspath('../react-frontend/build/')
static_dir   = os.path.abspath('../react-frontend/build/static')

app = Flask(__name__, static_folder=static_dir, template_folder=template_dir)

UPLOAD_FOLDER = os.path.basename('uploads')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = tensorflow.keras.models.load_model('./model/covid.h5')
model2 = tensorflow.keras.models.load_model('./model/please.h5')


print('model loaded')

@app.route('/api', methods=['GET'])
def index():
    print(template_dir)
    print(static_dir)
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():

    #print("Line 33 ======")
    listFileName = []
    files = request.files.getlist('image')

    for file in files:
      listFileName.append(file.filename)
      filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
      file.save(filename)
      print("=====uploads file or files======")
    return jsonify(listFileName)


@app.route('/api/predict', methods=['GET'])
def get_file():
    print("==== prediction function ====")
    usfileNameername = request.args.get('fileName')
    filepath = './uploads/' + usfileNameername
    print("filepath:" + filepath)

    img = Image.open(filepath)

    img = img.resize((64,64))

    img = np.array(img)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img / 255.0
    img = img.reshape(1,64,64,3)

    preds2 = model2.predict(img)

    result = []
    #xyz = preds[0][0] if preds [0][0] >
    #print(preds[0][1], preds[0][0])

    if preds2[0][1] > 0.5:
        img = Image.open(filepath)

        img = img.resize((224,224))

        img = np.array(img)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img / 255.0
        img = img.reshape(1,224,224,3)
        preds = model.predict(img)

        if preds[0][0] > 0.99:
            diag = "Covid"
            confidence = preds[0][0]
        else:
            diag = "Pneumonia"
            confidence = preds2[0][1]

    else:
        diag = "Neither Covid nor Pneumonia"
        confidence = preds2[0][0]

    return jsonify({"diagnosis":diag,"confidence":str(confidence)})

if __name__ == "__main__":
    # app.run(use_reloader=True, host="0.0.0.0", port=80, threaded=True)
    app.run(use_reloader=True, host="127.0.0.1", port=5000, threaded=True)
