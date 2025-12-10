const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try { 
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Un compte admin existe déjà:');
      console.log('   Nom:', existingAdmin.fullname);
      console.log('   Email:', existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    const adminData = {
      fullname: 'FleetTrack Admin',
      email: 'admin@fleettrack.com',
      password: 'admin123', 
      role: 'admin',
      telephone: '+212600000000'
    };

    const admin = await User.create(adminData);

    console.log('Compte admin créé avec succès!');
    console.log('-------------------------------');
    console.log('Email:', admin.email);
    console.log('Mot de passe: admin123');
    console.log('Nom:', admin.fullname);
    console.log('Téléphone:', admin.telephone);
    console.log('-------------------------------');

    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
