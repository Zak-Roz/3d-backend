'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        name VARCHAR(255) NULL,
        descriptions VARCHAR(255) NULL,
        fileId INTEGER UNSIGNED NULL,
        muscleGroup VARCHAR(255) NULL,
        level VARCHAR(255) NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT workoutsFileIdFk FOREIGN KEY (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS workout;');
  },
};
