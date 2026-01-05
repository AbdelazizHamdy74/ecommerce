exports.up = function (knex) {
  const client =
    (knex && knex.client && knex.client.config && knex.client.config.client) ||
    "";
  const isPostgres = ["pg", "postgres", "postgresql"].includes(client);

  const createTable = () =>
    knex.schema.createTable("users", function (table) {
      if (isPostgres) {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      } else {
        // MySQL: do not set a function call as DEFAULT (not supported on many MySQL versions)
        // Generate and set UUID in application code when inserting records.
        table.string("id", 36).primary().notNullable();
      }
      table.string("username").notNullable().unique();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable().unique().index();
      table.string("phone").notNullable().unique();
      table.string("password_hash").notNullable();
      table.date("birth_date").nullable();
      table.enu("gender", ["Male", "Female", "Other"]).nullable();
      table.string("profile_picture").nullable();
      table
        .enu("role", ["Admin", "Customer", "Supplier", "Delivery"])
        .notNullable()
        .defaultTo("Customer")
        .index();
      table.string("country").nullable();
      table.timestamp("deleted_at").nullable();
      table.timestamp("password_changed_at").nullable();
      table.timestamp("password_reset_expires").nullable();
      table.string("password_reset_code").nullable();
      table.boolean("password_reset_verified").defaultTo(false);
      table.string("otp_code").nullable();
      table.timestamp("otp_expires_at").nullable();
      table.boolean("is_active").defaultTo(true);
      table.timestamp("last_login_at").nullable();
      table.timestamps(true, true);
    });

  if (isPostgres) {
    return knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .then(createTable);
  }

  return createTable();
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
