const options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

module.exports = {
  async up(queryInterface, Sequelize) {
    // find demo user
    const [[{ id: demoUserId }]] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'demo@user.io';`
    );

    await queryInterface.bulkInsert(
      'Bookings',
      [
        {
          spotId: 1,
          userId: demoUserId,
          startDate: '2025-08-01',
          endDate: '2025-08-05',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          spotId: 2,
          userId: demoUserId,
          startDate: '2025-09-10',
          endDate: '2025-09-15',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          spotId: 3,
          userId: demoUserId,
          startDate: '2025-10-20',
          endDate: '2025-10-25',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', null, options);
  }
};