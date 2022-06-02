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
