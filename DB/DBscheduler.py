import sys
import os
import asyncio
import logging
from datetime import datetime
from logging import FileHandler


class UTF8FileHandler(FileHandler):
    def __init__(self, filename, mode='a', encoding='utf-8', delay=False):
        super().__init__(filename, mode, encoding, delay)


# 로그 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        UTF8FileHandler("scheduler.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)


async def run_script(script_name):
    current_time = datetime.now()
    logging.info(f"{script_name} 실행 중... 현재 시간: {current_time}")
    try:
        script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), script_name)
        process = await asyncio.create_subprocess_exec(
            sys.executable, script_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode == 0:
            logging.info(f"{script_name} 실행 완료\n{stdout.decode()}")
        else:
            logging.error(f"{script_name} 실행 실패 (코드: {process.returncode})\n{stderr.decode()}")
    except Exception as e:
        logging.error(f"{script_name} 실행 중 오류 발생: {e}")


async def scheduler():
    logging.info("스케줄러 실행 시작...")

    try:
        while True:
            now = datetime.now()
            tasks = []

            # 매 시간 30분마다 대기오염 데이터 스크립트 실행
            if now.minute == 30:
                logging.info("대기오염 데이터 스크립트를 실행합니다.")
                tasks.append(run_script("air_pollution_DB.py"))

            # 매 2시간(30분 기준)마다 중금속 데이터 스크립트 실행
            if now.hour % 2 == 0 and now.minute == 30:
                logging.info("중금속 데이터 스크립트를 실행합니다.")
                tasks.append(run_script("air_metal_DB.py"))

            # 비동기 작업 실행
            if tasks:
                await asyncio.gather(*tasks)

            # 1분 대기
            await asyncio.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        logging.info("스케줄러가 종료됩니다...")
        print("스케줄러가 종료됩니다...")


if __name__ == "__main__":
    asyncio.run(scheduler())
