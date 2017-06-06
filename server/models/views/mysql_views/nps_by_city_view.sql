CREATE VIEW `nps_by_city_view`
AS SELECT
   `nps`.`id` AS `id`,
   `nps`.`score_1` AS `score_1`,
   `nps`.`score_2` AS `score_2`,
   `nps`.`score_3` AS `score_3`,
   `nps`.`total` AS `total`,
   `User`.`id` AS `user_id`,
   `City`.`id` AS `city_id`,
   `City`.`name` AS `city_name`,
   `UserProgram`.`program_id` AS `program_id`
FROM ((`nps` left join `users` `User` on((`nps`.`user_id` = `User`.`id`))) join (`users_programs` `UserProgram` left join `cities` `City` on((`City`.`id` = `UserProgram`.`city_id`))) on((`UserProgram`.`user_id` = `User`.`id`)));