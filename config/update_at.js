module.exports = {
    onUpdateTrigger: table => `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
          RETURNS trigger AS $$
          BEGIN
            NEW.updated_at = now();
            RETURN NEW;
          END;
        $$ language 'plpgsql';
    
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
}