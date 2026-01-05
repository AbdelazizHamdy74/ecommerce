exports.up = function (knex) {
  const client =
    (knex && knex.client && knex.client.config && knex.client.config.client) ||
    "";
  const isPostgres = ["pg", "postgres", "postgresql"].includes(client);

  const createTable = () =>
    knex.schema.createTable("payment_methods", function (table) {
      if (isPostgres) {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("user_id").notNullable();
      } else {
        table.string("id", 36).primary().notNullable();
        table.string("user_id", 36).notNullable();
      }

      table
        .enu("type", ["card", "paypal", "bank_transfer", "other"])
        .notNullable();
      table.string("provider").nullable();
      table.string("last4").nullable();
      table.integer("expiry_month").nullable();
      table.integer("expiry_year").nullable();
      table.string("token").nullable();
      table.boolean("is_default").defaultTo(false);

      if (isPostgres) {
        table.jsonb("metadata").nullable();
      } else {
        table.json("metadata").nullable();
      }

      table.timestamps(true, true);

      table.foreign("user_id").references("users.id");
      table.index(["user_id"]);
    });

  if (isPostgres) {
    return knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .then(createTable);
  }

  return createTable();
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("payment_methods");
};
