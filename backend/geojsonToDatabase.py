import mysql.connector
import geojson
from geojson import FeatureCollection



def readInGeoJSON():
    mydb = mysql.connector.connect(
        host="us-cdbr-east-06.cleardb.net",
        user="b6f903096096fe",
        password="7a0c4b01",
        database="heroku_a69b82598923256"
    )
    mycursor = mydb.cursor()
    with open("parkingmap.geojson") as parkingSpotsFile:
        parkingSpots = geojson.load(parkingSpotsFile)
        spotId = 1
        for spot in parkingSpots['features']:
            spotInfo = spot['properties']
            lotName = spotInfo['Lot']
            numberInLot = spotInfo['Spot']
            tier = spotInfo['Tier']
            vanAccessible = 0 if spotInfo['Van_access'] == "no" else 1
            UofMPermitRequired = 0 if spotInfo['UofM_permit_req'] == "no" else 1
            val = (1, spotId, lotName, numberInLot, tier, vanAccessible, UofMPermitRequired)
            sql = "INSERT INTO Spot (Open, SpotId, LotName, NumberInLot, Tier, VanAccessible, UofMPermitRequired) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            mycursor.execute(sql, val)
            mydb.commit()
            spotInfo['SpotId'] = spotId
            spotInfo['Open'] = 1
            spotId += 1
    
    with open("parkingmap.geojson", "w") as parkingSpotsFile:
        geojson.dump(parkingSpots, parkingSpotsFile, indent=2)  
    return

readInGeoJSON()