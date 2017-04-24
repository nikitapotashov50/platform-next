CREATE VIEW `groups_view` as SELECT
'' as title, false as is_blocked, money,
total_score, 0 as migration_id, type, id, 0 as leader_id,
created_at, updated_at from groups;