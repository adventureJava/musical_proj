import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { submitCheck } from './notice';

const NOTICEModify = () => {
  const [notice, setNotice] = useState(null);
  const { nId } = useParams(); // URL 파라미터에서 nId를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/cs/api/notice_modify/${nId}`);
        setNotice(response.data);  // notice 데이터 설정          
      } catch (error) {
        console.error('Error fetching notice:', error);
      }
    };
    fetchNotice();
  }, [nId]);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkNotice()) {
      try {
        const response = await axios.post('http://localhost:8082/cs/api/notice_modify', notice);
        const resMeg = response.data;  // 서버로부터 받은 resMeg
                submitCheck(resMeg);  // resMeg를 submitCheck 함수에 전달
                if (resMeg === "success") {
                    navigate(-1);  // 등록 완료 후 페이지 이동
                }
      } catch (error) {
        console.error('Error updating notice:', error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nGroupKind') {
        // nGroupKind의 값에 따라 expandedIndex를 업데이트합니다.
        const newExpandedIndex = value === '티켓오픈' ? 0 : null;
        
        // notice 상태를 업데이트하고 expandedIndex 조건을 처리합니다.
        setNotice(prevNotice => ({
            ...prevNotice,
            [name]: value,
            nOpenTime: newExpandedIndex === 0 ? prevNotice.nOpenTime : null
        }));
        
        setExpandedIndex(newExpandedIndex);
    } else {
        // 다른 필드에 대한 notice 상태를 업데이트합니다.
        setNotice(prevNotice => ({
            ...prevNotice,
            [name]: value
        }));
    }
};


  const checkNotice = () => {
    
    if (!notice.nTitle.trim()) {
      alert('제목을 입력해주세요.');
      return false;
    }
    if (!notice.nGroupKind.trim()) {
      alert('카테고리를 선택해주세요.');
      return false;
    }
    if (!notice.nContent.trim()) {
      alert('내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  if (!notice) {
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

      <h4>공지사항 수정</h4>
      <form role="form" onSubmit={handleSubmit}>
        <label>제목</label>
        <input
          type="text"
          name="nTitle"
          value={notice.nTitle}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
        <label>카테고리</label>
        <select
          name="nGroupKind"
          value={notice.nGroupKind}
          onChange={handleChange}
          required
        >
          <option value="티켓오픈">티켓오픈</option>
          <option value="스포츠">스포츠</option>
          <option value="변경/취소">변경/취소</option>
          <option value="시스템관련">시스템관련</option>
          <option value="기타">기타</option>
        </select>
        <div id="datetimeContainer" className={expandedIndex === 0 ? 'show' : 'hide'}>
			<label>오픈 시간</label>
    <input type="datetime-local" id="nOpenTime" name="nOpenTime" onChange={handleChange} />
			</div>
        <label>내용</label>
        <textarea
          name="nContent"
          rows="18"
          value={notice.nContent}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        ></textarea>
        <button type="submit" className="signup">완료</button>
      </form>
    </div>
  );
};

export default NOTICEModify;
