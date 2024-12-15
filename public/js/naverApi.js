    // 백엔드에서 API 키 가져와 동적으로 스크립트 태그 삽입
    fetch('/api/naver-map-key')
      .then(response => response.json())
      .then(data => {
        const script = document.createElement('script');
        script.type = 'text/javascript';

        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${data.key}&submodules=geocoder`;
        document.head.appendChild(script);
      })
      .catch(error => console.error('API 키 로드 오류:', error));