package com.human.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.human.dto.FaqDto;
import com.human.dto.MusicalDto;
import com.human.dto.NoticeDto;
import com.human.dto.QaDto;
import com.human.dto.Venue_apiDto;
import com.human.service.IFaqService;
import com.human.service.INoticeService;
import com.human.service.IQaService;
import com.human.service.IVenue_apiService;
import com.human.vo.BoardVo;

@CrossOrigin(origins = "http://localhost:3001") // React 앱의 주소
@RestController
@RequestMapping("/api")
public class CSRestController {
	@Autowired
	private IFaqService service;

	@Autowired
	private INoticeService nservice;	
	
	@Autowired
	private IQaService aservice;
	
	@RequestMapping(value = "/faq_register", method = RequestMethod.POST)
	public ResponseEntity<String> registPOST(@RequestBody FaqDto faq) throws Exception {
		System.out.println(faq.getfContent());
		service.create(faq);
		String resMeg="success";
		return ResponseEntity.ok(resMeg);
	}
	
	@RequestMapping(value = "/faq_modify", method = RequestMethod.POST)
	public ResponseEntity<String> modifyPOST(@RequestBody FaqDto faq) throws Exception {
		service.update(faq);
		String resMeg="success";
		return ResponseEntity.ok(resMeg);
	}
	
	@GetMapping("/faq_modify/{fId}")
	public ResponseEntity<FaqDto> modifyGET(@PathVariable("fId") int fId) throws Exception {		
		FaqDto faq= service.read(fId);
		return ResponseEntity.ok(faq);
	}
	
	@RequestMapping(value = "/faq_remove", method = RequestMethod.POST)
	public ResponseEntity<String> remove(@RequestParam("fId") int fId) throws Exception {
		System.out.println(fId);
		service.delete(fId);
		String resMeg="success";
		return ResponseEntity.ok(resMeg);
	}

	
	@GetMapping("/faq")
	public Map<String, Object> getFaqs(
	    @RequestParam(value = "page", required = false, defaultValue = "1") int page,
	    @RequestParam(value = "perPageNum", required = false, defaultValue = "10") int perPageNum,
	    @RequestParam(value = "fGroupKind", required = false) String fGroupKind,
	    @RequestParam(value = "keyword", required = false) String keyword
	) throws Exception {
	    // VO 설정
	    BoardVo vo = new BoardVo();
	    vo.setPage(page);
	    vo.setPerPageNum(perPageNum);
	    vo.setfGroupKind(fGroupKind);
	    vo.setKeyword(keyword);

	    // 검색된 데이터 리스트
	    List<FaqDto> searchList = service.listSearch(vo);

	    // 전체 데이터 수 계산
	    int totalCount = service.listSearchCount(vo);
	    int totalPages = (int) Math.ceil((double) totalCount / perPageNum);

	    // 결과 반환
	    Map<String, Object> result = new HashMap<>();
	    result.put("faqs", searchList);  // FAQ 데이터
	    result.put("totalPages", totalPages);  // 전체 페이지 수

	    return result;
	}

	
	
	

//	@GetMapping("/faq")
//    public ResponseEntity<List<FaqDto>> getFaqs(BoardVo vo) throws Exception {
//        List<FaqDto> searchList = service.listSearch(vo);
//        vo.setTotalCount(service.listSearchCount(vo));
//        return ResponseEntity.ok(searchList);
//    }
}
