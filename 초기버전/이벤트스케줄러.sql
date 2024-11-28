SET GLOBAL event_scheduler = ON;

SHOW VARIABLES LIKE 'event_scheduler';




CREATE EVENT delete_week_old_data
ON SCHEDULE EVERY 1 WEEK
DO
DELETE FROM air_pollution_processed
WHERE timestamp < DATE_SUB(CURDATE(), INTERVAL 30 DAY);


CREATE EVENT delete_week_old_data_metal
ON SCHEDULE EVERY 1 WEEK
DO
DELETE FROM rael_time_metal_data
WHERE timestamp < DATE_SUB(CURDATE(), INTERVAL 30 DAY);



