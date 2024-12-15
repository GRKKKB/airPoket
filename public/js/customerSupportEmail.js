document.addEventListener("DOMContentLoaded", async () => {
    // 서버에서 EmailJS 키와 ID 가져오기
    const emailjsConfig = await fetch('/api/emailjs-config')
        .then((response) => response.json())
        .catch((error) => {
            console.error("EmailJS Config Fetch Error:", error);
            alert("EmailJS 설정을 로드하는 데 실패했습니다.");
        });

    if (emailjsConfig) {
        // EmailJS 초기화
        emailjs.init(emailjsConfig.userId);

        // 버튼 이벤트 리스너 추가
        document.getElementById("send-email-button").addEventListener("click", (event) => {
            sendEmail(event, emailjsConfig.serviceId, emailjsConfig.templateId);
        });
    }
});

function sendEmail(event, serviceId, templateId) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    // 폼 데이터 가져오기
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    // EmailJS에 보낼 데이터 구성
    const templateParams = {
        from_name: name,
        email: email,
        phone: phone,
        message: message,
    };

    console.log(templateParams);

    // EmailJS로 데이터 전송
    emailjs.send(serviceId, templateId, templateParams)
        .then(() => {
            alert("문의가 성공적으로 전송되었습니다!");
            document.getElementById("support-form").reset(); // 폼 초기화
        })
        .catch((error) => {
            console.error("EmailJS Error:", error);
            alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
        });
}
