db.races.aggregate([
    {"$match":{
        "year": 2021
        }
    },
    {
        $lookup:{
            "localField":"circuitId",
        "from":"circuits",
        "foreignField":"circuitId",
        "as":"circuitDetail"
        }
    },{
        $unwind:"$circuitDetail"
    },   {
        $project:{
            _id:0,
            "name":1,
            name2: "$circuitDetail.name",
        }
    }

])


db.drivers.aggregate([
    {
        $match:{
            "code": "ALO"
        }
    },
    {
        $project:{
            _id:0,
            "code":1,
            "driverId":1,
        }
    },
    {
        $lookup:{
            "localField":"driverId",
            "from":"driver_standings",
            "foreignField":"driverId",
            "as":"standings"
        }
    },
    {
        $unwind:"$standings"
    },
    {
        $project:{
            _id:0,
            "code":1,
            "driverId":1,
            "raceId": "$standings.raceId",
        }
    },
    {
        $lookup:{
            "localField":"raceId",
            "from":"races",
            "foreignField":"raceId",
            "as": "races"
        }
    },
    {
        $unwind: "$races"
    },
    {
        $project:{
            _id:0,
            "code":1,
            "driverId":1,
            "raceId": 1,
            "name": "$races.name",
            "year": "$races.year"
        }
    },
    {
        $match: {
            $and:[
                {
                    "name": "Spanish Grand Prix",
                    "year": 2021
                }
            ]

        }
    },
    {
        $lookup:{
            "from":"pit_stops",
            "let":{
                "driverId":"$driverId",
                "raceId":"$raceId"
            },
            "pipeline":[
                {
                    $match:{
                        $expr:{
                            $and:[
                                {
                                    $eq:["$driverId", "$$driverId"]
                                },
                                {
                                    $eq:["$raceId", "$$raceId"]
                                }
                            ]
                        }
                    }
                }
            ],
            "as":"pitStops"
        }
    },
    {
        $unwind: "$pitStops"
    },
    {
        $project:{
            _id:0,
            "code":1,
            "driverId":1,
            "raceId": 1,
            "name": 1,
            "year": 1,
            "stop": "$pitStops.stop",
            "duration": "$pitStops.duration"
        }
    }


])
