import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '../css/notice.css'; 
export const submitCheck =(resMeg) => {
  if(resMeg=="success"){
  alert("처리가 완료되었습니다.");
  }
};

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [fGroupKind, setFGroupKind] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1); // 현재 페이지
  const [perPageNum] = useState(10); // 한 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [startPage, setStartPage] = useState(1); // 시작 페이지 번호
  const [endPage, setEndPage] = useState(1); // 끝 페이지 번호
  const [prev, setPrev] = useState(false); // 이전 버튼 여부
  const [next, setNext] = useState(false); // 다음 버튼 여부
  const displayPageNum = 10; // 한 번에 보여줄 페이지 수
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [fId,setFId]= useState(null);

  useEffect(() => {
    fetchFaqs();  // 페이지 로드 시 FAQ 데이터 불러오기
  }, [page, fGroupKind, keyword]);

  useEffect(() => {
    if (fId !== null) {
      fetchFaqRemove();
    }
  }, [fId]);

  

  const fetchFaqRemove = async() => {
    try{
      const response = await axios.post('http://localhost:8082/cs/api/faq_remove', null,{
        params: { 
          fId : fId
        }
      });
      submitCheck(response.data);
      fetchFaqs();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('http://localhost:8082/cs/api/faq', {
        params: { 
          fGroupKind,
          keyword,
          page,
          perPageNum
        }
      });
      setFaqs(response.data.faqs);  // FAQ 데이터 설정
      setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
      calculatePagination(response.data.totalPages); // 페이지 계산
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

 
 
  const handleDeleteClick = (faqId) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      setFId(faqId);  // fId 설정하여 삭제 요청을 보냄
    }
  };

  // 페이지네이션 계산 함수
  const calculatePagination = (totalPages) => {
    const currentEndPage = Math.min(
      Math.ceil(page / displayPageNum) * displayPageNum, totalPages
    );
    const currentStartPage = currentEndPage - displayPageNum + 1;

    setStartPage(Math.max(currentStartPage, 1));
    setEndPage(currentEndPage);
    setPrev(currentStartPage > 1);
    setNext(currentEndPage < totalPages);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber); // 페이지 변경
    setExpandedIndex(null);
  };

  const handleRowClick = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index); // 현재 클릭된 인덱스가 기존과 같으면 접기, 다르면 펼치기
  };

  return (
    <div id="wrap">
      <div id="contents">
        <div id="content">
          <div className="board_qna">
            <h1 id="qna_head">자주 묻는 질문</h1>

            {/* 검색 필터 */}
            <div className="search_faq">
              <select
                name="fGroupKind"
                value={fGroupKind}
                onChange={(e) => setFGroupKind(e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="예매/취소">예매/취소</option>
                <option value="결제">결제</option>
                <option value="회원">회원</option>
                <option value="기타">기타</option>
              </select>
              <input
                type="text"
                name="keyword"
                id="keywordInput"
                placeholder="검색어 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button id="searchBtn" onClick={() => setPage(1)}>검색</button>
            </div>

            <div className="cs_board">
              <ul className="list_board_sort">
                <li className="_cat02"> <a href="#" onClick={() => setFGroupKind('전체')}>전체</a></li>
                <li className="_cat06"> <a href="#" onClick={() => setFGroupKind('예매/취소')}>예매/취소</a></li>
                <li className="_cat01"> <a href="#" onClick={() => setFGroupKind('결제')}>결제</a></li>
                <li className="_cat09"> <a href="#" onClick={() => setFGroupKind('회원')}>회원</a></li>
                <li className="_cat10"> <a href="#" onClick={() => setFGroupKind('기타')}>기타</a></li>
              </ul>
            </div>

            {/* FAQ 리스트 */}
            <div id="qnaList-wrapper">
              <table cellSpacing="0" border="0" className="tb_board tb_qna">
                <colgroup>
                  <col width="15%" />
                  <col width="70%" />
                  <col width="15%" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">카테고리</th>
                    <th scope="col">제목</th>
                    <th scope="col">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq, index) => (
                    <React.Fragment key={index}>
                      <tr className="item" onClick={() => handleRowClick(index)}>
                        <td>{faq.fGroupKind}</td>
                        <td>{faq.fTitle}</td>
                        <td>{new Date(faq.fWriteTime).toLocaleDateString()}</td>
                      </tr>
                      <tr className={expandedIndex === index ? "show" : "hide"}>
                        <td colSpan="3">
                          <pre>{faq.fContent}</pre>						
                          <Link to={`/faq_modify/${faq.fId}`}>
                              <button type="button" className="btn btn-warning">수정</button>
                            </Link>
                          <button type="button" onClick={() => handleDeleteClick(faq.fId)} className="btn btn-danger">삭제</button>
                         </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                {/* 첫 페이지로 이동 */}
                {page !== 1 && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
                    &lt;&lt;&lt;
                  </a>
                )}

                {/* 이전 페이지 그룹으로 이동 */}
                {prev && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(startPage - 1); }}>
                    &lt;&lt;
                  </a>
                )}

                {/* 이전 페이지로 이동 */}
                {page > 1 && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}>
                    &lt;
                  </a>
                )}

                {/* 페이지 번호 표시 */}
                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                  const pageIndex = startPage + idx;
                  return (
                    <a
                      key={pageIndex}
                      href="#"
                      className={page === pageIndex ? 'active' : ''}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageIndex); }}
                    >
                      {pageIndex}
                    </a>
                  );
                })}

                {/* 다음 페이지로 이동 */}
                {page < totalPages && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}>
                    &gt;
                  </a>
                )}

                {/* 다음 페이지 그룹으로 이동 */}
                {next && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(endPage + 1); }}>
                    &gt;&gt;
                  </a>
                )}

                {/* 마지막 페이지로 이동 */}
                {page !== totalPages && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>
                    &gt;&gt;&gt;
                  </a>
                )}
              </div>

              <Link to={`/faq_register`}><button className="newBtn" >새글</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
