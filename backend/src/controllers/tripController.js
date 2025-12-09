const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');

class TripController {
    /**
     * @desc    Créer un trajet (Admin)
     * @route   POST /api/trips
     */
    createTrip = async (req, res, next) => {
        try {
            const trip = await Trip.create(req.body);

            // Mise à jour du statut des véhicules
            await Vehicle.findByIdAndUpdate(req.body.truck, { status: 'in_transit' });
            if (req.body.trailer) {
                await Vehicle.findByIdAndUpdate(req.body.trailer, { status: 'in_transit' });
            }

            res.status(201).json({ success: true, data: trip });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Obtenir tous les trajets
     * @route   GET /api/trips
     */
    getAllTrips = async (req, res, next) => {
        try {
            const filter = {};

            // Si c'est un chauffeur, il ne voit que ses trajets
            if (req.user.role === 'chauffeur') {
                filter.driver = req.user.userId;
            } else {
                // Admin peut filtrer
                if (req.query.driver) filter.driver = req.query.driver;
            }

            if (req.query.status) filter.status = req.query.status;

            const trips = await Trip.find(filter)
                .populate('driver', 'fullname telephone')
                .populate('truck', 'Immatriculation brand model')
                .populate('trailer', 'Immatriculation brand model')
                .sort({ 'departure.date': -1 });

            res.status(200).json({ success: true, count: trips.length, data: trips });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Obtenir un trajet par ID
     * @route   GET /api/trips/:id
     */
    getTripById = async (req, res, next) => {
        try {
            const trip = await Trip.findById(req.params.id)
                .populate('driver', 'fullname telephone')
                .populate('truck', 'Immatriculation brand model')
                .populate('trailer', 'Immatriculation brand model');

            if (!trip) {
                return res.status(404).json({ message: 'Trip not found' });
            }

            res.status(200).json({ success: true, data: trip });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Mettre à jour un trajet (Statut, Km, Notes)
     * @route   PUT /api/trips/:id
     */
    updateTrip = async (req, res, next) => {
        try {
            let trip = await Trip.findById(req.params.id);

            if (!trip) {
                return res.status(404).json({ message: 'Trip not found' });
            }

            // Chauffeur ne peut modifier que ses trajets
            if (req.user.role === 'chauffeur' && trip.driver.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized to update this trip' });
            }

            trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });

            // Si le trajet est terminé, on libère les véhicules et met à jour le kilométrage
            if (req.body.status === 'completed') {
                if (trip.arrival.mileage) {
                    await Vehicle.findByIdAndUpdate(trip.truck, {
                        status: 'available',
                        mileage: trip.arrival.mileage
                    });
                } else {
                    await Vehicle.findByIdAndUpdate(trip.truck, { status: 'available' });
                }

                if (trip.trailer) {
                    await Vehicle.findByIdAndUpdate(trip.trailer, { status: 'available' });
                }
            }

            res.status(200).json({ success: true, data: trip });
        } catch (error) {
            next(error);
        }
    };

}

module.exports = new TripController();
