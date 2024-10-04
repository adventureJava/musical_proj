import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { submitCheck } from './faq';
import '../css/signup.css'; // 첫 번째 CSS 파일
import '../css/help_style.css'; // 두 번째 CSS 파일

const FAQRegister = () => {
    const navigate = useNavigate();
    const [faq, setFaq] = useState({
        fTitle: '',
        fGroupKind: '',
        fContent: ''
    });

    const handleChange = (e) => {
        setFaq({
            ...faq,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (checkFaq()) {
          try {
            const response = await axios.post('http://localhost:8082/cs/api/faq_register', faq);
            const resMeg = response.data;  // 서버로부터 받은 resMeg
                submitCheck(resMeg);  // resMeg를 submitCheck 함수에 전달
                if (resMeg === "success") {
                    navigate('/faq');  // 등록 완료 후 페이지 이동
                }
          } catch (error) {
            console.error('Error updating FAQ:', error);
          }
        }
    };

    

    const checkFaq = () => {
        if (!faq.fTitle.trim()) {
          alert('제목을 입력해주세요.');
          return false;
        }
        if (!faq.fGroupKind.trim()) {
          alert('카테고리를 선택해주세요.');
          return false;
        }
        if (!faq.fContent.trim()) {
          alert('내용을 입력해주세요.');
          return false;
        }
        return true;
    };

    return (
        <div className="container">
            <button type="button" className="btn btn-warning" onClick={() => navigate(-1)}>&lt; 이전</button>
            <h4>FAQ 등록</h4>
        
            <form role="form" onSubmit={handleSubmit}>
                <label>제목</label> 
                <input 
                    type="text" 
                    name="fTitle" 
                    value={faq.fTitle} 
                    onChange={handleChange} 
                    required 
                    placeholder="제목 입력" 
                    style={{ width: '100%' }} 
                />
                
                <label>카테고리</label>
                <select 
                    name="fGroupKind" 
                    value={faq.fGroupKind} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="예매/취소">예매/취소</option>
                    <option value="결제">결제</option>
                    <option value="회원">회원</option>
                    <option value="기타">기타</option>
                </select>
                
                <label>내용</label>
                <textarea 
                    name="fContent" 
                    value={faq.fContent} 
                    onChange={handleChange} 
                    rows="18" 
                    style={{ width: '100%' }} 
                    required 
                    placeholder="내용 입력"
                ></textarea>
                
                <button type="submit" className="signup">등록</button>
            </form>
        </div>
    );
};

export default FAQRegister;
