const User = require('../modules/auth/User.model');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@mensvibe.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'MensVibe Operations Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '9876543210',
        role: 'admin',
        isActive: true,
      });
      console.log(`⭐ Default Admin Account Created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`ℹ️ Admin Account already exists: ${adminEmail}`);
    }
  } catch (error) {
    console.error(`⚠️ Failed to seed default admin: ${error.message}`);
  }
};

module.exports = seedAdmin;
