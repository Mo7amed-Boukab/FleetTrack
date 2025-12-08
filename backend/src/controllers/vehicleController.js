const Vehicle = require('../models/Vehicle');

class VehicleController {
    /**
     * @desc    Get all vehicles
     * @route   GET /api/vehicles
     * @access  Private
     */
    getAllVehicles = async (req, res, next) => {
        try {
            const { type, status } = req.query;
            const filter = {};

            if (type) filter.type = type;
            if (status) filter.status = status;

            const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: vehicles.length,
                data: vehicles
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Get vehicle by ID
     * @route   GET /api/vehicles/:id
     * @access  Private
     */
    getVehicleById = async (req, res, next) => {
        try {
            const vehicle = await Vehicle.findById(req.params.id);

            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }

            res.status(200).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Create new vehicle
     * @route   POST /api/vehicles
     * @access  Private
     */
    createVehicle = async (req, res, next) => {
        try {
            const vehicle = await Vehicle.create(req.body);

            res.status(201).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Update vehicle
     * @route   PUT /api/vehicles/:id
     * @access  Private
     */
    updateVehicle = async (req, res, next) => {
        try {
            const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }

            res.status(200).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Delete vehicle
     * @route   DELETE /api/vehicles/:id
     * @access  Private
     */
    deleteVehicle = async (req, res, next) => {
        try {
            const vehicle = await Vehicle.findById(req.params.id);

            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }

            await vehicle.deleteOne();

            res.status(200).json({
                success: true,
                message: 'Vehicle deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new VehicleController();
