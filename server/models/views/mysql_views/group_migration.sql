CREATE VIEW `migrations_groups_view` as  SELECT id as user_id, current_program, all_programs,
couch as coach_group, '' as coach_group_program, ten as ten_group, '' as ten_group_program,
'' as ten_group_hundred, hundred as hundred_group, '' as hundred_group_program,
'' as hundred_group_polk, polk as polk_group, '' as polk_group_program,
'' as type, money_total as money, 0 as total_score from users;
