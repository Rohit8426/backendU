// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };


export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('agentPersonalInfo', 'userId', {
    type: Sequelize.INTEGER,
    allowNull: false, // Adjust based on your requirements
    references: {
      model: 'Users', // Table name of the User model
      key: 'id', // Primary key in the User table
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('agentPersonalInfo', 'userId');
}
