
CREATE TABLE `air_pollution_raw` (
   `id` INT NOT NULL AUTO_INCREMENT,
   `timestamp` DATE NOT NULL,
   `hour` TIME NOT NULL,
   `region` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
   `station_name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
   `pm25` FLOAT NULL DEFAULT NULL,
   `pm10` FLOAT NULL DEFAULT NULL,
   `so2` FLOAT NULL DEFAULT NULL,
   `co` FLOAT NULL DEFAULT NULL,
   `o3` FLOAT NULL DEFAULT NULL,
   `no2` FLOAT NULL DEFAULT NULL,
   `khai` FLOAT NULL DEFAULT NULL,
   PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;


DELIMITER $$

CREATE DEFINER=`test`@`localhost` PROCEDURE `clear_raw_data`()
BEGIN
    -- 테이블 초기화
    TRUNCATE TABLE air_pollution_raw;
END$$

DELIMITER ;


DELIMITER $$

CREATE DEFINER=`test`@`localhost` PROCEDURE `ProcessAirPollutionData`()
BEGIN
    -- 1. 가공 데이터를 저장할 테이블 생성
    CREATE TABLE IF NOT EXISTS air_pollution_processed (
        id INT AUTO_INCREMENT PRIMARY KEY,
        region VARCHAR(50),
        station_name VARCHAR(255),
        timestamp DATE,
        hour TIME,
        pm25 FLOAT,
        pm10 FLOAT,
        so2 FLOAT,
        co FLOAT,
        o3 FLOAT,
        no2 FLOAT,
        avg_pollution FLOAT,
        condition_category VARCHAR(50),
        weighted_score FLOAT, -- 가중치 점수
        health_score FLOAT    -- 종합 건강 점수
    );

    -- 2. 시간별 데이터 저장 테이블 생성
    CREATE TABLE IF NOT EXISTS air_pollution_exposure (
        exposure_id INT AUTO_INCREMENT PRIMARY KEY,
        pollution_id INT,
        mask_8h_in FLOAT,     -- 마스크 착용 8시간(내부)
        no_mask_8h_in FLOAT,  -- 마스크 미착용 8시간(내부)
        mask_12h_in FLOAT,    -- 마스크 착용 12시간(내부)
        no_mask_12h_in FLOAT, -- 마스크 미착용 12시간(내부)
        mask_8h_out FLOAT,    -- 마스크 착용 8시간(외부)
        no_mask_8h_out FLOAT, -- 마스크 미착용 8시간(외부)
        CONSTRAINT fk_pollution_id FOREIGN KEY (pollution_id) REFERENCES air_pollution_processed(id) ON DELETE CASCADE
    );

    -- 3. 원시 데이터를 가공하여 air_pollution_processed 테이블에 삽입
    INSERT INTO air_pollution_processed (
        region, 
        station_name, 
        timestamp, 
        hour, 
        pm25, 
        pm10, 
        so2, 
        co, 
        o3, 
        no2, 
        avg_pollution, 
        condition_category, 
        weighted_score, 
        health_score
    )
    SELECT 
        region,
        station_name,
        timestamp,
        hour,
        pm25,
        pm10,
        so2,
        co,
        o3,
        no2,
        -- 평균 오염도 계산
        (pm25 + pm10 + so2 + co + o3 + no2) / 6 AS avg_pollution,
        -- 오염 상태 분류
        CASE 
            WHEN (pm25 * 0.4 + o3 * 0.3 + no2 * 0.2 + so2 * 0.1 + co * 0.1 + pm10 * 0.1) <= 50 THEN 'Good'
            WHEN (pm25 * 0.4 + o3 * 0.3 + no2 * 0.2 + so2 * 0.1 + co * 0.1 + pm10 * 0.1) BETWEEN 51 AND 100 THEN 'Moderate'
            WHEN (pm25 * 0.4 + o3 * 0.3 + no2 * 0.2 + so2 * 0.1 + co * 0.1 + pm10 * 0.1) BETWEEN 101 AND 150 THEN 'Unhealthy for Sensitive Groups'
            WHEN (pm25 * 0.4 + o3 * 0.3 + no2 * 0.2 + so2 * 0.1 + co * 0.1 + pm10 * 0.1) BETWEEN 151 AND 200 THEN 'Unhealthy'
            ELSE 'Very Unhealthy'
        END AS condition_category,
        -- 가중치 점수 계산
        (pm25 * 0.4 + o3 * 0.3 + no2 * 0.2 + so2 * 0.1 + co * 0.1 + pm10 * 0.1) AS weighted_score,
        -- 종합 건강 점수 계산
        100 - (
            (pm25 * 0.4 + o3 * 0.3 + no2 * 0.2 + so2 * 0.1 + co * 0.1 + pm10 * 0.1)
            * CASE 
                WHEN region LIKE '%외부%' THEN 1.2 -- 외부 가중치
                ELSE 1.0 -- 내부 가중치
              END
            * CASE 
                WHEN station_name LIKE '%마스크%' THEN 0.8 -- 마스크 착용
                ELSE 1.0 -- 마스크 미착용
              END
        ) AS health_score
    FROM air_pollution_raw;

    -- 4. 시간별 데이터 삽입
    INSERT INTO air_pollution_exposure (
        pollution_id,
        mask_8h_in,
        no_mask_8h_in,
        mask_12h_in,
        no_mask_12h_in,
        mask_8h_out,
        no_mask_8h_out
    )
    SELECT 
        id,
        -- 마스크 착용/미착용 시간별 데이터
        ROUND((100 - weighted_score) * 0.8, 2) AS mask_8h_in, 			-- 8시간 마스크 끼고 내부
        ROUND((100 - weighted_score) * 1.0, 2) AS no_mask_8h_in,		-- 8시간 마스크안  끼고  내부
        ROUND((100 - weighted_score) * 0.7, 2) AS mask_12h_in,			-- 12시간 마스크끼고 내부
        ROUND((100 - weighted_score) * 1.2, 2) AS no_mask_12h_in,		-- 12시간 마스크 끼고 내부    
        ROUND((100 - weighted_score) * 0.6, 2) AS mask_8h_out,			-- 8시간 마스크 끼고 외부
        ROUND((100 - weighted_score) * 1.5, 2) AS no_mask_8h_out,		-- 8시간 마스크 끼고 외부
        ROUND((100 - weigherd_score) * 0.7, 2) AS mask_12h_out,	-- 12시간 마스크 안끼고 외부 
        ROUND((100 - weigherd_score) * 0.6, 2) AS no_mask_12h_out,	-- 12시간 마스크 끼고 외부 
    FROM air_pollution_processed;

END$$

DELIMITER ;
