
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dictionary').del()
    .then(function () {
      // Inserts seed entries
      return knex('dictionary').insert(
        
      );
    });
};
