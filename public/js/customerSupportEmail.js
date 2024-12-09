// EmailJS 초기화
(function () {
    emailjs.init("Qx7d4HQk3iGbBWLUl");
})();

function sendEmail(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    // Input 값 가져오기
    var from_name = document.getElementById("name").value; // 사용자의 이름
    var email = document.getElementById("email").value; // 사용자의 이메일
    var phone = document.getElementById("phone").value; // 사용자의 전화번호
    var message = document.getElementById("message").value; // 문의 내용

    // EmailJS에 보낼 데이터
    var templateParams = {
        from_name: from_name, // 보낸 사람 이름
        name: from_name,      // 이름
        email: email,         // 이메일
        phone: phone,         // 전화번호
        message: message      // 문의 내용
    };

    // EmailJS 전송
    emailjs
        .send("service_roqavba", "template_p5yia8q", templateParams)
        .then(
            function (response) {
                // alert("문의가 성공적으로 전송되었습니다!");
                showAlert("문의가 성공적으로 전송되었습니다!");
                document.getElementById("support-form").reset(); // 폼 초기화
            },
            function (error) {
                // alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
                showAlert("문의 전송에 실패했습니다. 다시 시도해주세요.");
                console.error("EmailJS Error:", error);
            }
        );
}
