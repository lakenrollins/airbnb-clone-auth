const options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

module.exports = {
  async up(queryInterface, Sequelize) {
    // find demo user
    const [[{ id: demoUserId }]] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'demo@user.io';`
    );

    await queryInterface.bulkInsert(
      'Reviews',
      [
        {
          userId: demoUserId,
          spotId: 1,
          review: 'The Ocean Breeze Villa was absolutely stunning. Loved waking up to the sound of waves!',
          stars: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: demoUserId,
          spotId: 1,
          review: 'Very clean and comfortable, but parking was a bit tricky.',
          stars: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: demoUserId,
          spotId: 2,
          review: 'Maple Cottage was cozy and perfect for a fall getaway. The leaves were beautiful.',
          stars: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: demoUserId,
          spotId: 2,
          review: 'Nice location, but the WiFi was slow during my stay.',
          stars: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, options);
  }
};