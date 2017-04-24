CREATE VIEW `goals_view` as SELECT target_point_a as a, target_point_b as b, 0 as fact,
approved_money as confimred, 0 as fine, true as is_closed, null as start_at,
null as finish_at, occupation as occupation, id as user_id, created_at, updated_at, 0 as goal_id FROM users;