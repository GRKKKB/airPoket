import requests

url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty"
params = {
    "serviceKey": "DX8uG5d+VR7XcHY3s0gfcy6Rp0htpeKiMBhLDguoSyQPTYxY+IdB2vZQtw3Z2/KRVBD1Lfw5HuWCqk978lbA3w==",
    "returnType": "xml",
    "numOfRows": 100,
    "pageNo": 1,
    "sidoName": "전북",
    "ver": "1.0"
}

try:
    response = requests.get(url, params=params, timeout=10)  # 타임아웃 10초
    response.raise_for_status()  # HTTP 오류 발생 시 예외 처리
    print(response.text)
except requests.exceptions.Timeout:
    print("요청 시간이 초과되었습니다.")
except requests.exceptions.RequestException as e:
    print(f"요청 중 오류 발생: {e}")
