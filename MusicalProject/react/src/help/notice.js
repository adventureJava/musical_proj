import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
export const submitCheck =(resMeg) => {
    if(resMeg=="success"){
    alert("처리가 완료되었습니다.");
    }
  };

const NOTICE = () => {  
  const [notices, setNotices] = useState([]);
  const [nGroupKind, setNGroupKind] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('');
  const [page, setPage] = useState(1); // 현재 페이지
  const [perPageNum] = useState(10); // 한 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [startPage, setStartPage] = useState(1); // 시작 페이지 번호
  const [endPage, setEndPage] = useState(1); // 끝 페이지 번호
  const [prev, setPrev] = useState(false); // 이전 버튼 여부
  const [next, setNext] = useState(false); // 다음 버튼 여부
  const displayPageNum = 10; // 한 번에 보여줄 페이지 수  

  useEffect(() => {
    fetchNotices();  // 페이지 로드 시 FAQ 데이터 불러오기
  }, [page, nGroupKind, keyword]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://localhost:8082/cs/api/notice', {
        params: { 
          nGroupKind,
          searchType,
          keyword,
          page,
          perPageNum
        }
      });
      setNotices(response.data.notices);  // FAQ 데이터 설정
      setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
      calculatePagination(response.data.totalPages); // 페이지 계산
    } catch (error) {
      console.error('Error fetching FAQs:', error);
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
  };


  return (
  <div id="wrap">
		<div id="contents">
			<div id="content">
      <div className="board_qna">
					<h1 id="qna_head">공지사항</h1>


					<div className="cs_board">
						<ul className="list_board_sort">
							<li className="_cat02" data-cat="02"><a href="#" onClick={() => setNGroupKind('전체')}
								className="link_tab _faqCategory">전체</a></li>
							<li className="_cat06" data-cat="06"><a
								href="#" onClick={() => setNGroupKind('티켓오픈')} className="link_tab _faqCategory">티켓오픈</a></li>
							<li className="_cat01" data-cat="01"><a
								href="#" onClick={() => setNGroupKind('스포츠')} className="link_tab _faqCategory">스포츠</a></li>
							<li className="_cat09" data-cat="09"><a
								href="#" onClick={() => setNGroupKind('변경/취소')} className="link_tab _faqCategory">변경/취소</a></li>
							<li className="_cat10" data-cat="10"><a
								href="#" onClick={() => setNGroupKind('시스템관련')} className="link_tab _faqCategory">시스템관련</a></li>
							<li className="_cat10" data-cat="10"><a
								href="#" onClick={() => setNGroupKind('기타')} className="link_tab _faqCategory">기타</a></li>
						</ul>
					</div>

					<div id="qnaList-wrapper">
						<table border="0" className="tb_board tb_qna">
							<colgroup>
								<col width="15%"/>
								<col width="63%"/>
								<col width="15%"/>
								<col width="7%"/>
							</colgroup>
							<thead>
								<tr className="">
									<th scope="col">카테고리</th>
									<th scope="col">제목</th>
									<th scope="col">오픈/등록일</th>
									<th scope="col">조회수</th>
								</tr>
							</thead>
							<tbody>
              {notices.map((notice, index) => (
                    <React.Fragment key={index}>
									<tr className="item">
										<td>{notice.nGroupKind }</td>
										<td><Link to={`/notice_read/${notice.nId}`}>{notice.nTitle }</Link>
                    </td>
										<td>{notice.nOpenTime ? (
                    <>오픈: {new Date(notice.nOpenTime).toLocaleString()}</>
                    ) : (new Date(notice.nWriteTime).toLocaleString())}
                    </td>
										<td>{notice.nHit }</td>
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
						
						<div className="search_faq">
							<select name="searchType" 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}>
								<option value="제목" >제목</option>
								<option value="내용">내용</option>
								<option value="제목내용">제목+내용</option>
							</select>							
							<input type="text" name="keyword" id="keywordInput" placeholder="검색어 입력"
								value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                />
							<button id="searchBtn">검색</button>
						</div>
					</div>
          <Link to={`/notice_register`}><button className="newBtn" >새 글</button>
          </Link>
				</div>
			</div>
		</div>
	</div>
  );
};

export default NOTICE;