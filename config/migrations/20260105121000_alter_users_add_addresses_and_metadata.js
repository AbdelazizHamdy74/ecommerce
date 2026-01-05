exports.up = function (knex) {
  const client =
    (knex && knex.client && knex.client.config && knex.client.config.client) ||
    "";
  const isPostgres = ["pg", "postgres", "postgresql"].includes(client);

  return knex.schema.table("users", function (table) {
    if (isPostgres) {
      table.uuid("billing_address_id").nullable();
      table.uuid("shipping_address_id").nullable();
    } else {
      table.string("billing_address_id", 36).nullable();
      table.string("shipping_address_id", 36).nullable();
    }

    table.timestamp("email_verified_at").nullable();
    table.timestamp("phone_verified_at").nullable();

    if (isPostgres) {
      table.jsonb("metadata").nullable();
    } else {
      table.json("metadata").nullable();
    }

    table.string("preferred_language", 10).nullable();
    table.string("preferred_currency", 10).nullable();
    table.boolean("marketing_consent").defaultTo(false);

    table.index(["billing_address_id"]);
    table.index(["shipping_address_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropIndex(["billing_address_id"]);
    table.dropIndex(["shipping_address_id"]);
    table.dropColumn("billing_address_id");
    table.dropColumn("shipping_address_id");
    table.dropColumn("email_verified_at");
    table.dropColumn("phone_verified_at");
    table.dropColumn("metadata");
    table.dropColumn("preferred_language");
    table.dropColumn("preferred_currency");
    table.dropColumn("marketing_consent");
  });
};
