module.exports = {
  async up(queryInterface, Sequelize) {
    const options = process.env.NODE_ENV === 'production' ? { schema: process.env.SCHEMA } : {};

    // Retrieve the demo user's ID
    const demoUserId = await queryInterface.rawSelect(
      'Users',
      { where: { email: 'demo@user.io' } },
      ['id']
    );

    if (!demoUserId) {
      console.log("Demo user not found, skipping spot seeding.");
      return;
    }

    // Insert new sample spots with different data
    await queryInterface.bulkInsert(
      'Spots',
      [
        {
          ownerId: demoUserId,
          address: '555 Mountain Road',
          city: 'Denver',
          state: 'Colorado',
          country: 'USA',
          lat: 39.7392,
          lng: -104.9903,
          name: 'Mountain Retreat',
          description: 'A peaceful getaway in the Rockies.',
          price: 220,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: demoUserId,
          address: '789 Lakeview Ave',
          city: 'Madison',
          state: 'Wisconsin',
          country: 'USA',
          lat: 43.0731,
          lng: -89.4012,
          name: 'Lakeside Haven',
          description: 'Charming cottage with lake views.',
          price: 160,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: demoUserId,
          address: '404 Downtown Blvd',
          city: 'Austin',
          state: 'Texas',
          country: 'USA',
          lat: 30.2672,
          lng: -97.7431,
          name: 'City Lights Loft',
          description: 'Trendy loft in the heart of the city.',
          price: 275,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      options
    );

    // Get the IDs of the inserted spots
    const spots = await queryInterface.sequelize.query(
      'SELECT id FROM "Spots" WHERE "ownerId" = :ownerId',
      {
        replacements: { ownerId: demoUserId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!spots.length) {
      console.log("No spots inserted, skipping spot images.");
      return;
    }

    // Assign spot IDs
    const [spotA, spotB, spotC] = spots;

    // Insert new sample spot images with different data
    await queryInterface.bulkInsert(
      'SpotImages',
  [
    { spotId: spotA.id, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', preview: true, createdAt: new Date(), updatedAt: new Date() }, // Mountain Retreat
    { spotId: spotA.id, url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', preview: false, createdAt: new Date(), updatedAt: new Date() },
    { spotId: spotB.id, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', preview: true, createdAt: new Date(), updatedAt: new Date() }, // Lakeside Haven
    { spotId: spotC.id, url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', preview: true, createdAt: new Date(), updatedAt: new Date() }, // City Lights Loft
  ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', null, {});
    await queryInterface.bulkDelete('Spots', null, {});
  },
};