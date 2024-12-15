import requests
import pandas as pd
import os
import xml.etree.ElementTree as ET
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import logging
from logging import FileHandler

# .env 파일 로드
load_dotenv()

# UTF-8 로그 핸들러 클래스
class UTF8FileHandler(FileHandler):
    def __init__(self, filename, mode='a', encoding='utf-8', delay=False):
        # log 폴더 경로 설정
        log_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "log")
        os.makedirs(log_folder, exist_ok=True)  # log 폴더가 없으면 생성
        full_path = os.path.join(log_folder, filename)  # log/metal_data.log로 설정
        super().__init__(full_path, mode, encoding, delay)

# 로그 포맷 설정
log_format = "%(asctime)s [%(levelname)s] %(message)s"
date_format = "%Y-%m-%d %H:%M:%S"

# 로그 설정
metal_logger = logging.getLogger("metal_data_logger")
metal_logger.setLevel(logging.INFO)

# 파일 핸들러 설정
file_handler = UTF8FileHandler("metal_data.log", encoding="utf-8")
file_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))

# 스트림 핸들러 설정
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))

# 핸들러 추가
metal_logger.addHandler(file_handler)
metal_logger.addHandler(stream_handler)

# 로그 시작
metal_logger.info("중금속 데이터 처리 스크립트 시작.")


# 데이터베이스 연결 정보
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT", 3306)  # 기본값 3306

# 외부 API 키
API_SERVICE_KEY = os.getenv("API_SERVICE_KEY_METAL")


# DB 연결 설정
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# 중금속 데이터 기준치 (항목 코드별 기준치 정의)
guideline_values = {
    90303: 500,    # 납 
    90304: 20,     # 니켈 
    90305: 150,    # 망간 
    90314: 120000, # 아연 
    90325: 20000   # 황 
}

# 측정소 이름 (측정소 코드와 측정소 이름 매핑)
station_names = {
    1: '수도권',
    2: '백령도',
    3: '호남권',
    4: '중부권',
    5: '제주도',
    6: '영남권',
    7: '경기권',
    8: '충청권',
    9: '전북권',
    10: '강원권',
    11: '충북권'
}

# 항목 코드와 기호 (항목 코드와 중금속 기호 매핑)
item_symbols = {
    90303: 'Pb',   # 납
    90304: 'Ni',   # 니켈
    90305: 'Mn',   # 망간 
    90314: 'Zn',   # 아연 
    90325: 'S'     # 황 
}

# 중금속 데이터 가져오기 및 처리 함수
def fetch_metal_data():
    current_date = pd.Timestamp.now().strftime("%Y%m%d")  # 현재 날짜
    current_time = pd.Timestamp.now().strftime("%H%M")    # 현재 시간
    records = []  # 데이터를 저장할 리스트

    for item_code, item_symbol in item_symbols.items():
        for station_code, station_name in station_names.items():
            try:
                url = (
                    f'http://apis.data.go.kr/1480523/MetalMeasuringResultService/MetalService'
                    f'?serviceKey={API_SERVICE_KEY}&pageNo=1&numOfRows=1&resultType=XML&'
                    f'date={current_date}&stationcode={station_code}&itemcode={item_code}&timecode=RH02'
                )
                response = requests.get(url)

                if response.status_code == 200:
                    root = ET.fromstring(response.content)
                    item = root.find(".//item")
                    if item is not None:
                        value = float(item.findtext("value") or 0.0)
                        guideline = guideline_values.get(item_code)
                        air_metal_index = value / guideline if guideline else None

                        records.append({
                            'timestamp': current_date,
                            'hour': current_time,
                            'region': station_name,
                            'category': item_symbol,
                            'measurement': value,
                            'air_metal_score': air_metal_index
                        })
                        metal_logger.info(f"{station_name}의 {item_symbol} 데이터 성공적으로 가져옴.")
                else:
                    metal_logger.error(f"{station_name}의 {item_symbol} 데이터 가져오기 실패. 상태 코드: {response.status_code}")

            except Exception as e:
                metal_logger.error(f"{station_name}의 {item_symbol} 데이터 처리 중 오류 발생: {e}")

    if records:
        df = pd.DataFrame(records)
        try:
            with engine.connect() as connection:
                df.to_sql(name='metal_data', con=connection, if_exists='append', index=False)
                metal_logger.info("중금속 데이터가 DB 테이블 'metal_data'에 저장 완료.")

                connection.execute(text("CALL NormalizeMetalData()"))
                metal_logger.info("데이터 정규화 프로시저 실행 완료.")

                connection.execute(text("CALL ClearMetalData()"))
                connection.commit()
                metal_logger.info("원시 데이터 삭제 프로시저 실행 완료.")
        except Exception as e:
            metal_logger.error(f"DB 저장 또는 프로시저 실행 중 오류 발생: {e}")
    else:
        metal_logger.warning("가져온 데이터가 없습니다.")

# 데이터 가져오기 함수 호출
fetch_metal_data()
