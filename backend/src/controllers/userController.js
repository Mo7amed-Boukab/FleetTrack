const User = require('../models/User');

class UserController {
    /**
     * @desc    Get all users
     * @route   GET /api/users
     * @access  Private
     */
    getAllUsers = async (req, res, next) => {
        try {
            const users = await User.find({ role: 'chauffeur' }).select('-password'); // Exclure le mot de passe
            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Get single user
     * @route   GET /api/users/:id
     * @access  Private
     */
    getUserById = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Create user
     * @route   POST /api/users
     * @access  Private
     */
    createUser = async (req, res, next) => {
        try {
            const { fullname, email, password, role, telephone, status } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = await User.create({
                fullname,
                email,
                password,
                role,
                telephone,
                status
            });

            const userResponse = {
               _id: user._id,
               fullname: user.fullname,
               email: user.email,
               role: user.role,
               telephone: user.telephone,
               status: user.status,
               createdAt: user.createdAt,
               updatedAt: user.updatedAt
           };

            res.status(201).json({
                success: true,
                data: userResponse
            });

        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Update user
     * @route   PUT /api/users/:id
     * @access  Private
     */
    updateUser = async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(
               req.params.id,
               req.body,
               {
                   new: true,          
                   runValidators: true
               }
            ).select('-password'); 

            if (!user) {
               return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
              success: true,
              data: user
         });

        } catch (error) {
            next(error);
        }
    };

    /**
     * @desc    Delete user
     * @route   DELETE /api/users/:id
     * @access  Private
     */
    deleteUser = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.deleteOne();

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserController();
