const tripModel = require('../models/trip.model')

async function tripAdditionController(req, res){
    console.log(req.body)
    try{
        let tripDetail = tripModel.Trip({
            tripName: req.body.tripName,
            startDateOfJourney: req.body.startDateOfJourney,
            endDateOfJourney: req.body.endDateOfJourney,
            nameOfHotels: req.body.nameOfHotels,
            placesVisited: req.body.placesVisited,
            totalCost: req.body.totalCost,
            tripType: req.body.tripType,
            experience: req.body.experience,
            image: req.body.image,
            shortDescription: req.body.shortDescription,
            featured: req.body.featured
        })
        await tripDetail.save()
        res.send('Trip added Successfully')
    }catch(error){
        console.error('Error adding trip:', error)
        res.status(500).json({ error: 'SOMETHING WENT WRONG', details: error.message })
    }
}

async function getTripDetailsController(req,res){
    try{
        tripModel.Trip.find({})
        .then(doc => res.json(doc))
        .catch(err => {
            console.error('Error fetching trips:', err)
            res.status(500).json({ error: 'SOMETHING WENT WRONG WHILE FETCHING', details: err.message })
        })
    }catch(error){
        console.error('Error in getTripDetailsController:', error)
        res.status(500).json({ error: 'SOMETHING WENT WRONG', details: error.message })
    }
}

async function getTripDetailsByIdController(req,res){
    try{
        tripModel.Trip.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: 'Nothing in database' })
            }
            res.json(doc)
        })
        .catch(err => {
            console.error('Error fetching trip by ID:', err)
            res.status(404).json({ error: 'Nothing in database', details: err.message })
        })
    }catch(error){
        console.error('Error in getTripDetailsByIdController:', error)
        res.status(500).json({ error: 'SOMETHING WENT WRONG', details: error.message })
    }
}
module.exports = { tripAdditionController, getTripDetailsController, getTripDetailsByIdController }