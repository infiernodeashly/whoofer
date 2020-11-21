module.exports = function(sequelize, DataTypes) {
  const Whoof = sequelize.define("Whoof", {
    // The email cannot be null, and must be a proper email before creation
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1],
    },
  });

  Whoof.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Whoof.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our databaseq
  return Whoof;
};
