import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { submitCheck } from './notice';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const NOTICEREAD = () => {
  const [notice, setNotices] = useState([]);
  const { nId } = useParams(); 
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [NID,setNId]= useState(null);

    useEffect(() => {
      const fetchNread = async () => {
        try {
          const response = await axios.get(`http://localhost:8082/cs/api/notice_read/${nId}`);
          setNotices(response.data);           
        } catch (error) {
          console.error('Error fetching FAQ:', error);
        }
      };
      fetchNread();
    }, [nId]);

    useEffect(() => {
      if (NID !== null) {
        fetchFaqRemove();
      }
    }, [NID]);
  
    
  
    const fetchFaqRemove = async() => {
      try{
        const response = await axios.post('http://localhost:8082/cs/api/notice_remove', null,{
          params: { 
            nId : NID
          }
        });
        submitCheck(response.data);
        navigate('/notice');
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
  
    const handleDeleteClick = (NID) => {
      const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
      if (confirmDelete) {
        setNId(NID);  // fId 설정하여 삭제 요청을 보냄
      }
    };

  return(
    <div className="container">
	<input type="text" name='nTitle' style={{width: "100%", outline: "none"}} className='read_title'
			defaultValue={notice.nTitle} readOnly={true}/>
			
	<label>{notice.nGroupKind} | {new Date(notice.nWriteTime).toLocaleString()}
	{notice.nOpenTime && (
  <>| 오픈일 {new Date(notice.nOpenTime).toLocaleString()}<br /></>
)}
	</label>
<label>조회수 : {notice.nHit} </label> 
<br />
	<hr />
	<br />
		<textarea name="nContent" rows="3" className='read_board' style={{outline: "none"}} 
			readOnly={true} defaultValue={notice.nContent}></textarea>
	
<hr />

	<div className="box-footer">
	<button type="submit" className="go_notice" id='go_notice' onClick={() => navigate(-1)}>뒤로 가기</button>
		 
  <Link to={`/notice_modify/${notice.nId}`}><button type="submit" className="btn btn-primary">수정</button></Link>
  <button type="submit" className="btn btn-danger" onClick={() => handleDeleteClick(notice.nId)}>삭제</button>
		
		
	</div>
</div>
  );
};
export default NOTICEREAD;