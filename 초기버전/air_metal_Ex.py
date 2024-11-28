import requests
import pandas as pd
import os
import sqlalchemy
import xml.etree.ElementTree as ET

# 환경부 국립환경과학원_미세먼지(금속성분) 실시간 정보 엑셀로 변환
# 데이터 링크 https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15016368
# 중금속 데이터 기준치
guideline_values = {
    90303: 500,    # 납 (WHO 기준: 0.5 µg/m³를 ng/m³로 변환)
    90304: 20,     # 니켈 (WHO 기준: 0.02 µg/m³를 ng/m³로 변환)
    90305: 150,    # 망간 (WHO 기준: 0.15 µg/m³를 ng/m³로 변환)
    90314: 120000, # 아연 (캐나다 기준: 120 µg/m³를 ng/m³로 변환)
    90325: 20000   # 황 (WHO SO₂ 기준: 20 µg/m³를 ng/m³로 변환)
}

# DB 연결 설정
engine = sqlalchemy.create_engine("mysql+pymysql://test:1234@127.0.0.1:3306/pythondb")

# 측정소 이름
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

# 항목 코드와 기호 
item_symbols = {
    90303: 'Pb',   # 납
    90304: 'Ni',   # 니켈
    90305: 'Mn',   # 망간
    90314: 'Zn',   # 아연
    90325: 'S'     # 황
}

# 엑셀 파일을 저장할 디렉토리 생성
output_dir = 'air_metal_reports'
os.makedirs(output_dir, exist_ok=True)

# 중금속 데이터 가져오기 및 처리
def fetch_metal_data():
    current_date = pd.Timestamp.now().strftime("%Y%m%d")
    current_time = pd.Timestamp.now().strftime("%H%M")
    records = []
    for item_code, item_symbol in item_symbols.items():
        for station_code, station_name in station_names.items():
            try:
                # 서비스키 uri 기본 서비스키 일일제한이 10000이라 굳이 바꿀필요는 없음 
                # 서비스 키는 serviceKey=DX8uG5d%2BVR7XcHY3s0gfcy6Rp0htpeKiMBhLDguoSyQPTYxY%2BIdB2vZQtw3Z2%2FKRVBD1Lfw5HuWCqk978lbA3w%3D%3D 를 바꾸면됨
                # 일반인증키 (Encoding) 사용
                url = f'http://apis.data.go.kr/1480523/MetalMeasuringResultService/MetalService?serviceKey=DX8uG5d%2BVR7XcHY3s0gfcy6Rp0htpeKiMBhLDguoSyQPTYxY%2BIdB2vZQtw3Z2%2FKRVBD1Lfw5HuWCqk978lbA3w%3D%3D&pageNo=1&numOfRows=1&resultType=XML&date={current_date}&stationcode={station_code}&itemcode={item_code}&timecode=RH02'
                response = requests.get(url)
                if response.status_code == 200:
                    xml_text = response.content
                    root = ET.fromstring(xml_text)
                    item = root.find(".//item")
                    if item is not None:
                        value = item.findtext("value")
                        value = float(value) if value else 0.0
                        guideline = guideline_values.get(item_code, None)
                        air_metal_score_index = value / guideline if guideline else None
                        records.append({
                            'timestamp': f"{current_date}",
                            'hour':f"{current_time}",
                            'region': station_name,
                            'category': item_symbol,
                            'measurement': value,
                            'air_metal_score': air_metal_score_index
                        })
                else:
                    print(f"{station_name}의 {item_symbol} 데이터 안가져와짐 오류 코드: {response.status_code}")
            except Exception as e:
                print(f"{station_name}의 {item_symbol} 데이터 저장중에 오류남 왜그럴까: {e}")
    
    # DataFrame 생성 및 엑셀 및 CSV 저장
    if records:
        df = pd.DataFrame(records)
        output_filename_xlsx = os.path.join(output_dir, f'metal_{current_date}_{current_time}.xlsx')
        output_filename_csv = os.path.join(output_dir, f'metal_{current_date}_{current_time}.csv')
        df.to_excel(output_filename_xlsx, index=False)
        df.to_csv(output_filename_csv, index=False,encoding='utf-8-sig')
        print(f"중금속 데이터가 {output_filename_xlsx} 및 {output_filename_csv}에 저장완료 ")

# 데이터 가져오기 호출
fetch_metal_data()
