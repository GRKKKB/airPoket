import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactUs.css'; // CSS 파일을 임포트합니다.

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_roqavba', 'template_p5yia8q', form.current, {
        publicKey: '69Dsb7wcmIBomBPgN',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );
  };

  return (
    <div className="contact-container">
      <h1>고객지원</h1>
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <label>이름</label>
        <input type="text" name="user_name" placeholder="Your name" required />
        
        <label>이메일 주소</label>
        <input type="email" name="user_email" placeholder="Your email address" required />
        
        <label>전화번호</label>
        <input type="tel" name="user_phone" placeholder="Your phone number" required />
        
        <label>문의 내용</label>
        <textarea name="message" placeholder="Comments" required />
        
        <input type="submit" value="전송" className="submit-button" />
      </form>
    </div>
  );
};
