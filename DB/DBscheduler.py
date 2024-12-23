import asyncio
import logging
import os
import sys
from datetime import datetime
import webview
from logging import FileHandler

# 플랫폼에 따른 알림 소리
def play_alert_sound():
    try:
        if sys.platform == "win32":
            import winsound
            winsound.Beep(440, 500)  # 주파수 440Hz, 500ms
        else:
            os.system('echo -e "\a"')  # 리눅스/맥에서 기본 알림 소리
    except Exception as e:
        logging.error(f"알림 소리를 재생하는 중 오류 발생: {e}")


class UTF8FileHandler(FileHandler):
    def __init__(self, filename, mode='a', encoding='utf-8', delay=False):
        log_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "log")
        os.makedirs(log_folder, exist_ok=True)  # 로그 폴더 생성
        full_path = os.path.join(log_folder, filename)
        super().__init__(full_path, mode, encoding, delay)


# 로그 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        UTF8FileHandler("scheduler.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)


class SchedulerManager:
    """스케줄러 관리 클래스"""
    def __init__(self):
        self.running = False  # 스케줄러 실행 상태
        self.loop = None      # 스케줄러 이벤트 루프
        self.logs = []        # 로그 저장 리스트

    def log(self, message):
        """로그 추가"""
        self.logs.append(f"{datetime.now()}: {message}")
        logging.info(message)

    async def run_script(self, script_name):
        """스케줄된 Python 스크립트를 실행"""
        current_time = datetime.now()
        self.log(f"{script_name} 실행 중... 현재 시간: {current_time}")
        try:
            script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), script_name)
            process = await asyncio.create_subprocess_exec(
                sys.executable, script_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            if process.returncode == 0:
                self.log(f"{script_name} 실행 완료\n{stdout.decode()}")
            else:
                self.log(f"{script_name} 실행 실패 (코드: {process.returncode})\n{stderr.decode()}")
                play_alert_sound()  # 오류 시 알림 소리
        except Exception as e:
            self.log(f"{script_name} 실행 중 오류 발생: {e}")
            play_alert_sound()  # 오류 시 알림 소리

    async def scheduler(self):
        """스케줄러 실행"""
        self.log("스케줄러 실행 시작...")
        try:
            while self.running:
                now = datetime.now()
                tasks = []

                # 매 시간 30분마다 대기오염 데이터 스크립트 실행
                if now.minute == 30:
                    self.log("대기오염 데이터 스크립트를 실행합니다.")
                    tasks.append(self.run_script("air_pollution_DB.py"))

                # 매 2시간(30분 기준)마다 중금속 데이터 스크립트 실행
                if now.hour % 2 == 0 and now.minute == 30:
                    self.log("중금속 데이터 스크립트를 실행합니다.")
                    tasks.append(self.run_script("air_metal_DB.py"))

                # 비동기 작업 실행
                if tasks:
                    await asyncio.gather(*tasks)

                # 1분 대기
                await asyncio.sleep(60)
        except Exception as e:
            self.log(f"스케줄러 오류 발생: {e}")
            play_alert_sound()  # 오류 시 알림 소리
        finally:
            self.log("스케줄러가 종료되었습니다.")

    def start(self):
        """스케줄러 시작"""
        if not self.running:
            self.running = True
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            self.loop.run_until_complete(self.scheduler())

    def stop(self):
        """스케줄러 중지"""
        if self.running:
            self.running = False
            if self.loop:
                self.loop.stop()


scheduler_manager = SchedulerManager()


class API:
    """API 클래스 정의"""
    def start_scheduler(self):
        """스케줄러 시작"""
        if not scheduler_manager.running:
            scheduler_manager.start()
            return "스케줄러가 시작되었습니다."
        return "스케줄러는 이미 실행 중입니다."

    def stop_scheduler(self):
        """스케줄러 중지"""
        if scheduler_manager.running:
            scheduler_manager.stop()
            return "스케줄러가 중지되었습니다."
        return "스케줄러는 이미 중지되어 있습니다."

    def clear_logs(self):
        """모든 로그 파일 및 메모리 로그 초기화"""
        log_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "log")
        for log_file in ["scheduler.log", "air_pollution.log", "metal_data.log"]:
            log_path = os.path.join(log_folder, log_file)
            if os.path.exists(log_path):
                open(log_path, "w").close()  # 파일 내용 초기화
        scheduler_manager.logs.clear()
        return "모든 로그가 초기화되었습니다."

    def get_logs(self):
        """scheduler.log 반환"""
        return "\n".join(scheduler_manager.logs)

    def get_air_pollution_logs(self):
        """air_pollution.log 내용 반환"""
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "log", "air_pollution.log")
        if os.path.exists(log_path):
            with open(log_path, "r", encoding="utf-8") as f:
                return f.read()
        return "air_pollution.log 파일이 없습니다."

    def get_metal_data_logs(self):
        """metal_data.log 내용 반환"""
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "log", "metal_data.log")
        if os.path.exists(log_path):
            with open(log_path, "r", encoding="utf-8") as f:
                return f.read()
        return "metal_data.log 파일이 없습니다."

    def get_status(self):
        """스케줄러 상태 반환"""
        return "실행 중" if scheduler_manager.running else "중지됨"


def create_gui():
    """Pywebview로 GUI 생성"""
    api = API()  # API 객체 생성
    window = webview.create_window(
        "Python 스케줄러",
        html="""<!DOCTYPE html>
        <html>
        <head>
            <title>스케줄러</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .container { text-align: center; margin-top: 5%; }
                .logs { margin-top: 20px; width: 80%; height: 200px; border: 1px solid #ccc; overflow-y: scroll; padding: 10px; }
                button { padding: 10px 20px; font-size: 18px; margin: 5px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Python 스케줄러</h1>
                <p id="status">상태: 중지됨</p>
                <button onclick="startScheduler()">시작</button>
                <button onclick="stopScheduler()">중지</button>
                <button onclick="getLogs()">메인 로그 보기</button>
                <button onclick="getAirPollutionLogs()">대기오염 로그 보기</button>
                <button onclick="getMetalDataLogs()">중금속 로그 보기</button>
                <button onclick="clearLogs()">로그 초기화</button>
                <div id="logs" class="logs"></div>
            </div>
            <script>
                function updateStatus() {
                    pywebview.api.get_status().then(status => {
                        document.getElementById('status').innerText = `상태: ${status}`;
                    });
                }

                function startScheduler() { pywebview.api.start_scheduler().then(() => updateStatus()); }
                function stopScheduler() { pywebview.api.stop_scheduler().then(() => updateStatus()); }
                function getLogs() { pywebview.api.get_logs().then(logs => { document.getElementById('logs').innerText = logs; }); }
                function getAirPollutionLogs() { pywebview.api.get_air_pollution_logs().then(logs => { document.getElementById('logs').innerText = logs; }); }
                function getMetalDataLogs() { pywebview.api.get_metal_data_logs().then(logs => { document.getElementById('logs').innerText = logs; }); }
                function clearLogs() { pywebview.api.clear_logs().then(response => { alert(response); getLogs(); }); }
                updateStatus();
            </script>
        </body>
        </html>""",
        js_api=api  # API 객체를 설정
    )
    webview.start(debug=True, gui='edge')


if __name__ == "__main__":
    create_gui()
