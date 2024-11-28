import requests
import pandas as pd
import xml.etree.ElementTree as ET
from sqlalchemy import create_engine, text
import logging
from logging import FileHandler

# UTF-8 로그 핸들러 클래스
class UTF8FileHandler(FileHandler):
    def __init__(self, filename, mode='a', encoding='utf-8', delay=False):
        super().__init__(filename, mode, encoding, delay)
        
# 로그 포맷 설정
log_format = "%(asctime)s [%(levelname)s] %(message)s"
date_format = "%Y-%m-%d %H:%M:%S"

# 로그 설정
pollution_logger = logging.getLogger("air_pollution_logger")
pollution_logger.setLevel(logging.INFO)

# 파일 핸들러 설정
file_handler = UTF8FileHandler("air_pollution.log", encoding="utf-8")
file_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))

# 스트림 핸들러 설정
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))

# 핸들러 추가
pollution_logger.addHandler(file_handler)
pollution_logger.addHandler(stream_handler)

# 로그 시작
pollution_logger.info("대기오염 데이터 처리 스크립트 시작.")


# DB 연결 설정
engine = create_engine("mysql+pymysql://test:1234@127.0.0.1:3306/pythondb")

# 안전한 float 변환 함수
def safe_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0

# 도시 목록
cities_korean = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종']
cities_english = ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju', 'Sejong']

# API 링크
url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty'

# 데이터 가져오기 및 처리
records = []
for city_korean, city_english in zip(cities_korean, cities_english):
    params = {
        'serviceKey': 'DX8uG5d+VR7XcHY3s0gfcy6Rp0htpeKiMBhLDguoSyQPTYxY+IdB2vZQtw3Z2/KRVBD1Lfw5HuWCqk978lbA3w==',
        'returnType': 'xml',
        'numOfRows': '100',
        'pageNo': '1',
        'sidoName': city_korean,
        'ver': '1.0'
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        try:
            root = ET.fromstring(response.content)
            for item in root.findall(".//item"):
                station_name = item.findtext("stationName")
                pm25 = safe_float(item.findtext("pm25Value"))
                pm10 = safe_float(item.findtext("pm10Value"))
                so2 = safe_float(item.findtext("so2Value"))
                co = safe_float(item.findtext("coValue"))
                o3 = safe_float(item.findtext("o3Value"))
                no2 = safe_float(item.findtext("no2Value"))
                khai = safe_float(item.findtext("khaiValue"))

                # 데이터 검증 및 저장
                if station_name:  # station_name은 반드시 있어야 함
                    item_data = {
                        'timestamp': pd.Timestamp.now().strftime("%Y-%m-%d"),
                        'hour': pd.Timestamp.now().strftime("%H:%M:%S"),
                        'region': city_english,
                        'station_name': station_name,
                        'pm25': pm25,
                        'pm10': pm10,
                        'so2': so2,
                        'co': co,
                        'o3': o3,
                        'no2': no2,
                        'khai': khai
                    }
                    records.append(item_data)
            pollution_logger.info(f"{city_korean} 지역 데이터 가져오기 성공.")
        except ET.ParseError as e:
            pollution_logger.error(f"{city_korean} XML 파싱 오류: {e}")
    else:
        pollution_logger.error(f"{city_korean} 데이터 가져오기 실패. 상태 코드: {response.status_code}")

# 데이터베이스에 저장
if records:
    df = pd.DataFrame(records)
    try:
        df.to_sql(name='air_pollution_raw', con=engine, if_exists='append', index=False)
        pollution_logger.info("대기오염 데이터가 DB 테이블 'air_pollution_raw'에 저장 완료.")

        # 프로시저 실행
        with engine.connect() as conn:
            conn.execute(text("CALL ProcessAirPollutionData()"))
            pollution_logger.info("가공 데이터 프로시저 실행 완료.")
            
            conn.execute(text("CALL clear_raw_data()"))
            conn.commit()
            pollution_logger.info("원시 데이터 삭제 프로시저 실행 완료.")
    except Exception as e:
        pollution_logger.error(f"DB 저장 또는 프로시저 실행 중 오류 발생: {e}")
else:
    pollution_logger.warning("가져온 데이터가 없습니다.")
