//고객지원 이메일 기능 구현
function sendEmail(event) {
    event.preventDefault();

    // 가져올 input 요소들
    var from_name = document.getElementById("name").value; // 사용자의 이름
    var email = document.getElementById("email").value; // 사용자의 이메일
    var phoneNum = document.getElementById("phoneNum").value; //사용자의 전화번호
    var message = document.getElementById("message").value; // 문의 내용

    var templateParams = {
        from_name: from_name,  // 보낸 사람 이름
        name: from_name,       // 이름 (보낸사람)
        email: email,          // 이메일
        phoneNum: phoneNum,    // 전화번호
        message: message       // 문의 내용
    };

    emailjs.send('service_roqavba', 'template_p5yia8q', templateParams, {
        PublicKey: '69Dsb7wcmIBomBPgN',
        })
        .then(function(response) {
            alert('문의가 성공적으로 전송되었습니다!');
        }, function(error) {
            alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
        });
}