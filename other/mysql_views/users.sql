CREATE VIEW `users_view` AS SELECT name, email, first_name, last_name,
birthday, gender, locale, timezone,
remote_ip, uid, picture_small,
picture_large, 0 as migration_id, id, created_at, updated_at
FROM users;