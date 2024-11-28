CREATE TABLE metal_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATE NOT NULL,
    hour TIME NOT NULL,
    region VARCHAR(50) NOT NULL,
    category VARCHAR(10) NOT NULL,
    measurement FLOAT NOT NULL,
    air_metal_score FLOAT
);



DELIMITER $$

CREATE PROCEDURE NormalizeMetalData()
BEGIN
    -- 1. 지역 데이터 삽입 (region 테이블 생성 및 데이터 추가)
    CREATE TABLE IF NOT EXISTS region (
        region_id INT AUTO_INCREMENT PRIMARY KEY,
        region_name VARCHAR(50) UNIQUE
    );

    INSERT IGNORE INTO region (region_name)
    SELECT DISTINCT region
    FROM metal_data;

    -- 2. 측정 항목 데이터 삽입 (category 테이블 생성 및 데이터 추가)
    CREATE TABLE IF NOT EXISTS category (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(50) UNIQUE
    );

    INSERT IGNORE INTO category (category_name)
    SELECT DISTINCT category
    FROM metal_data;

    -- 3. 정규화된 데이터 테이블 생성
    CREATE TABLE IF NOT EXISTS metal_data_normalized (
        id INT PRIMARY KEY,
        timestamp DATETIME,
        hour TIME,
        region_id INT,
        category_id INT,
        measurement DECIMAL(10, 4),
        risk_idx DECIMAL(10, 6),
        FOREIGN KEY (region_id) REFERENCES region(region_id),
        FOREIGN KEY (category_id) REFERENCES category(category_id)
    );

    -- 4. 데이터 삽입 (metal_data_normalized)
    INSERT INTO metal_data_normalized (id, timestamp, hour, region_id, category_id, measurement, risk_idx)
    SELECT
        md.id,
        md.timestamp,
        md.hour,
        r.region_id,
        c.category_id,
        md.measurement,
        md.risk_idx
    FROM
        metal_data md
    JOIN region r ON md.region = r.region_name
    JOIN category c ON md.category = c.category_name;

END$$

DELIMITER ;

CALL NormalizeMetalData();




-- 원본 메탈데이터 삭제 프로시저
DELIMITER $$

CREATE PROCEDURE ClearMetalData()
BEGIN
    -- 기존 데이터 삭제
    TRUNCATE TABLE metal_data;
END$$

DELIMITER ;


CALL ClearMetalData();



