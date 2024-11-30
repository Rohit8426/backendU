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
  await queryInterface.addColumn('User', 'fullName', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
export async function down(queryInterface) {
  await queryInterface.removeColumn('User', 'fullName');
}
