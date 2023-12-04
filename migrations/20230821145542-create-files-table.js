'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        
        name VARCHAR(255) NOT NULL,
        fileKey VARCHAR(255) NOT NULL,
        status TINYINT NOT NULL DEFAULT 1 COMMENT '1 - pending, 2 - loaded', 

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS files;');
  },
};
