import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { submitCheck } from './faq';
import '../css/signup.css'; // 첫 번째 CSS 파일
import '../css/help_style.css'; // 두 번째 CSS 파일

const FAQModify = () => {
  const [faq, setFaq] = useState(null);
  const { fId } = useParams(); // URL 파라미터에서 fId를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/cs/api/faq_modify/${fId}`);
        setFaq(response.data);  // FAQ 데이터 설정          
      } catch (error) {
        console.error('Error fetching FAQ:', error);
      }
    };
    fetchFaq();
  }, [fId]);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkFaq()) {
      try {
        const response = await axios.post('http://localhost:8082/cs/api/faq_modify', faq);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFaq({ ...faq, [name]: value });
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

  if (!faq) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => navigate(-1)} // 이전 페이지로 이동
      >
        &lt; 이전
      </button>

      <h4>FAQ 수정</h4>
      <form role="form" onSubmit={handleSubmit}>
        <label>제목</label>
        <input
          type="text"
          name="fTitle"
          value={faq.fTitle}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
        <label>카테고리</label>
        <select
          name="fGroupKind"
          value={faq.fGroupKind}
          onChange={handleChange}
          required
        >
          <option value="예매/취소">예매/취소</option>
          <option value="결제">결제</option>
          <option value="회원">회원</option>
          <option value="기타">기타</option>
        </select>
        <label>내용</label>
        <textarea
          name="fContent"
          rows="18"
          value={faq.fContent}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        ></textarea>
        <button type="submit" className="signup">완료</button>
      </form>
    </div>
  );
};

export default FAQModify;
