import json
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from urllib.request import urlopen

app = Flask(__name__)

# Path to your Firebase service account key JSON file
cred = credentials.Certificate('gkey.json')  # Update this path
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://flask-app-30d4e-default-rtdb.firebaseio.com/'  # Update with your database URL
})

@app.route('/')
def index():
    return "Hello, Firebase!"

@app.route('/add_data')
def add_data():
    # Sample data to push to Firebase
    with urlopen("https://ssd-api.jpl.nasa.gov/nhats.api") as response:
        source=response.read()
    data=json.loads(source)    
    count=0
    list_info=[]
    for item in data["data"]:
        dict_info=dict()
        if len(list_info)>49: break
        dict_info["type"]="Aestroid"
        dict_info["des"]=item["des"]
        dict_info["fullname"]=item["fullname"].strip()
        if not("2024" in  dict_info["fullname"]):
            continue
        dict_info["size"]=(float(item["min_size"])+float(item["max_size"]))/(2)
        dict_info["radius"]=dict_info["size"]/2
        dict_info["speed"]=float(item["min_dv"]["dv"])
        dict_info["timetaken"]=item["min_dv"]["dur"]
        a="%20".join(dict_info["des"].split())
        with urlopen(f"https://ssd-api.jpl.nasa.gov/nhats.api?des={a}") as data_aestroid:
            source_data=data_aestroid.read()
            data1=json.loads(source_data)
            dur_out=int(data1["min_dur_traj"]["dur_out"])*86400
            v_dep_earth=float(data1["min_dur_traj"]["v_dep_earth"])
            approx_distance_from_earth=(v_dep_earth*dur_out)
            dict_info["distance"]=approx_distance_from_earth
        list_info.append(dict_info)
        print(len(list_info))
    print("done")
    result={"Asteroid_info":list_info}
    # Reference to the location in the database where you want to store the data
    ref = db.reference('users2')  # You can change 'users' to any path you want
    # Push data to Firebase
    ref.set(result)
    return jsonify({"success": True, "message": "Data added to Firebase!"})

if __name__ == "__main__":
    app.run(debug=True)
