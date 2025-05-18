const options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

module.exports = {
  async up(queryInterface, Sequelize) {
    // (Assumes the above reviews have been seeded and got IDs 21–24)
    await queryInterface.bulkInsert(
      'ReviewImages',
      [
        // For Review #1
        {
          reviewId: 1,
          url: 'https://images.example.com/review21-main.jpg',
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // For Review #2
        {
          reviewId: 2,
          url: 'https://images.example.com/review22-main.jpg',
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // For Review #3
        {
          reviewId: 3,
          url: 'https://images.example.com/review23-main.jpg',
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // For Review #4
        {
          reviewId: 4,
          url: 'https://images.example.com/review24-main.jpg',
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, options);
  }
};