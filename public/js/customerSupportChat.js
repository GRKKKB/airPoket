document.addEventListener("DOMContentLoaded", () => {
    const faqSelect = document.getElementById("faq-select");
    const sendButton = document.getElementById("send-button");
    const chatOutput = document.getElementById("chat-output");

    // 기본 메시지 추가
    const introMessages = [
        "안녕하세요! 에어포켓 고객지원 챗봇입니다. 😊",
        "궁금하신 내용을 질문 목록에서 선택해주세요!",
        "목록에 없는 질문은 '메일 보내기'를 통해 문의하실 수 있습니다. 감사합니다!"
    ];

    introMessages.forEach(message => {
        const botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot");

        // 이미지 추가
        const botImage = document.createElement("img");
        botImage.src = "/public/img/airlogo.jpg";
        botImage.alt = "Bot";
        botImage.classList.add("chat-image");

        // 메시지 텍스트 추가
        const messageText = document.createElement("div");
        messageText.classList.add("chat-text");
        messageText.textContent = message;

        // 메시지와 이미지를 분리하여 추가
        botMessage.appendChild(botImage);
        botMessage.appendChild(messageText);
        chatOutput.appendChild(botMessage);
    });

    sendButton.addEventListener("click", () => {
        const selectedQuestion = faqSelect.options[faqSelect.selectedIndex].text;
        const selectedAnswer = faqSelect.value;

        if (selectedAnswer) {
            // 사용자 메시지 추가
            const userMessage = document.createElement("div");
            userMessage.classList.add("chat-message", "user");

          

            const userMessageText = document.createElement("div");
            userMessageText.classList.add("chat-text");
            userMessageText.textContent = selectedQuestion;


            userMessage.appendChild(userMessageText);
            chatOutput.appendChild(userMessage);

            // 봇 메시지 추가
            const botMessage = document.createElement("div");
            botMessage.classList.add("chat-message", "bot");

            const botImage = document.createElement("img");
            botImage.src = "/public/img/airlogo.jpg";
            botImage.alt = "Bot";
            botImage.classList.add("chat-image");

            const botMessageText = document.createElement("div");
            botMessageText.classList.add("chat-text");
            botMessageText.textContent = selectedAnswer;

            botMessage.appendChild(botImage);
            botMessage.appendChild(botMessageText);
            chatOutput.appendChild(botMessage);

            // 스크롤을 최신 메시지로 이동
            chatOutput.scrollTop = chatOutput.scrollHeight;

            // 선택 초기화
            faqSelect.selectedIndex = 0;
        } else {
            // alert("질문을 선택하세요!");
            showAlert("질문을 선택하세요");
        }
    });
});
