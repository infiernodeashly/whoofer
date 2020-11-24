module.exports = function(sequelize, DataTypes) {
  const Whoof = sequelize.define("Whoof", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1],
    },
  });

  Whoof.associate = function(models) {
    Whoof.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Whoof;
};
