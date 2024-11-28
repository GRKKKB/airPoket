import sys
import os
import subprocess
import datetime
import time
import logging

# 로그 설정
logging.basicConfig(
    filename="scheduler.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

def run_script(script_name):
    """
    지정된 Python 스크립트를 실행합니다.
    """
    current_time = datetime.datetime.now()
    logging.info(f"{script_name} 실행 중... 현재 시간: {current_time}")
    try:
        script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), script_name)
        
        subprocess.run([sys.executable, script_path], check=True)  # sys.executable 사용
        logging.info(f"{script_name} 실행 완료")
    except subprocess.CalledProcessError as e:
        logging.error(f"{script_name} 실행 실패: {e}")

if __name__ == "__main__":
    logging.info("테스트 실행 시작...")
    
    # 테스트 실행
    print("대기오염 데이터 스크립트 테스트 실행:")
    run_script("air_pollution_DB.py")
    print("중금속 데이터 스크립트 테스트 실행:")
    run_script("air_metal_DB.py")
