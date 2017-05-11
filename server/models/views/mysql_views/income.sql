CREATE VIEW `incomes_view` as SELECT
approved_money as amount, true as is_confirmed, id as user_id,
created_at, updated_at from users;