'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('usuarios', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true
      },

      usuario: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true
      },

      senha_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      email_verificado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      email_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      email_token_expira_en: {
        type: Sequelize.DATE,
        allowNull: true
      },

      email_codigo: {
        type: Sequelize.STRING(10),
        allowNull: true
      },

      email_codigo_tentativas: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      status_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};