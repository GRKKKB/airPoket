from sqlalchemy import create_engine, text

# DB 연결 설정
engine = create_engine("mysql+pymysql://test:1234@127.0.0.1:3306/pythondb")

# 프로시저 실행 함수
def execute_processing_procedures():
    try:
        with engine.connect() as conn:
            # 1. 원시 데이터를 가공하는 프로시저 실행
            conn.execute(text("CALL process_raw_data_to_main_table()"))
            print("process_raw_data_to_main_table 프로시저 실행 완료")

            # 2. 추가적인 데이터 분석/집계를 위한 프로시저 실행 (필요시 추가)
            conn.execute(text("CALL update_health_index_analysis()"))
            print("update_health_index_analysis 프로시저 실행 완료")

            # 3. 완료 후 원시 데이터 삭제
            conn.execute(text("TRUNCATE TABLE air_pollution_raw"))
            print("원시 데이터 테이블 'air_pollution_raw'가 비워졌습니다.")
    except Exception as e:
        print(f"프로시저 실행 중 오류 발생: {e}")

if __name__ == "__main__":
    execute_processing_procedures()
