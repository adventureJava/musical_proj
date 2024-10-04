import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function FAQ() {
  const [faqs, setFaqs] = useState([]); // FAQ 데이터를 저장할 상태
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('fGroupKind');
    if (category) {
      setSelectedCategory(category);
    }
    fetchFAQs();
  }, [searchParams]);

  useEffect(() => {
    if (message === 'success') {
      alert('처리가 완료되었습니다.');
    }
  }, [message]);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('/api/faq', {
        params: {
          fGroupKind: selectedCategory,
          keyword: keyword
        }
      });
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    navigate(`/faq?fGroupKind=${selectedCategory}&keyword=${keyword}&page=1&perPageNum=10`);
    fetchFAQs(); // 검색 버튼 클릭 시 데이터를 다시 불러옵니다.
  };

  const handleNewFAQ = () => {
    navigate('/faq_register');
  };

  const handleModifyFAQ = () => {
    navigate('/faq_modify', { method: 'get' });
  };

  const handleRemoveFAQ = () => {
    navigate('/faq_remove', { method: 'post' });
  };

  const toggleArticle = (index) => {
    setFaqs(faqs.map((faq, i) => (
      i === index ? { ...faq, show: !faq.show } : faq
    )));
  };

  return (
    <div>
      <h2>FAQ</h2>
      <div>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {/* 옵션을 추가하세요 */}
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button id="searchBtn" onClick={handleSearch}>검색</button>
        <button className="newBtn" onClick={handleNewFAQ}>새 FAQ 등록</button>
      </div>
      <table className="tb_board">
        {faqs.map((faq, index) => (
          <React.Fragment key={index}>
            <tr className="item" onClick={() => toggleArticle(index)}>
              <td>{faq.question}</td>
            </tr>
            {faq.show && (
              <tr className="show">
                <td>{faq.answer}</td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </table>
      <div>
        <button className="btn-warning" onClick={handleModifyFAQ}>수정</button>
        <button className="btn-danger" onClick={handleRemoveFAQ}>삭제</button>
      </div>
    </div>
  );
}

export default FAQ;