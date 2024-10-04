import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FAQ from './help/faq';
import FAQModify from './help/faq_modify';
import FAQRegister from './help/faq_register';
import NOTICE from './help/notice.js';
import NOTICEREAD from './help/notice_read.js';
import NOTICEmodify from './help/notice_modify.js';

function App() {
  return (
    <Router>
      <div>        
        <Routes>
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq_register" element={<FAQRegister />} />
          <Route path="/faq_modify/:fId" element={<FAQModify />} />
          <Route path="/notice" element={<NOTICE/>} />
          <Route path="/notice_read/:nId" element={<NOTICEREAD/>} />
          <Route path="/notice_modify/:nId" element={<NOTICEmodify/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;