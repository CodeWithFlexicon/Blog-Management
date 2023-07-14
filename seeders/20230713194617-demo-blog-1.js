"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Felix",
          email: "Felix@Felix.com",
          password: await bcrypt.hash("password", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Troll",
          email: "Troll@troll.com",
          password: await bcrypt.hash("password", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const users = await queryInterface.sequelize.query(`SELECT id FROM users`);

    const userId = users[0][0].id;

    await queryInterface.bulkInsert(
      "posts",
      [
        {
          title: "Become Bigger",
          content: "Just buy some steroids and sarms, it's that easy",
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Why not just eat more",
          content:
            "The more you eat, the more you can workout because you have so much energy",
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const posts = await queryInterface.sequelize.query(`SELECT id FROM posts`);

    const postId = posts[0][0].id;

    const trollId = users[0][1].id;

    await queryInterface.bulkInsert("comments", [
      {
        content: "Wow what great advice, time to blow up in size",
        UserId: trollId,
        PostId: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("comments", null, {});
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
