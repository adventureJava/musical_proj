package com.human.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.human.controller.AdminController;
import com.human.dto.AdminDto;
import com.human.dto.HallDto;
import com.human.dto.VenueDto;
import com.human.dto.Venue_apiDto;
import com.human.service.IHallService;
import com.human.service.IMusicalScheduleService;
import com.human.service.IReservationService;
import com.human.service.ISeatService;
import com.human.service.IVenueService;

import com.human.service.IVenue_apiService;
import com.human.vo.BoardVo;

@Controller
@RequestMapping("/vh_admin/*")
public class VenueHall_adminController {
	
	private AdminController adminController;

			
	@Autowired
	private IVenue_apiService venue_apiservice;
		
	@Autowired
	private IHallService hallservice;
	@Autowired
	private IVenueService venueservice;
	
	@Autowired
	private IReservationService reservationservice;
	@Autowired
	private ISeatService seatservice;
	@Autowired
	private IMusicalScheduleService mu_schservice;
	
	
	
	@RequestMapping(value = "/admin_venue", method = RequestMethod.GET)
	public String admin_venue(BoardVo vo, Model model) throws Exception {
		List<VenueDto> searchList = venueservice.venue_listSearch(vo);
		model.addAttribute("list", searchList);
		vo.setTotalCount(venueservice.venue_listSearchCount(vo));
		return "admin/admin_venue";
	}
	
	@RequestMapping(value = "/venue_register_file", method = RequestMethod.GET)
	public String venue_register_file(@RequestParam("searchType") String searchType,@RequestParam("fileName") String fileName,Model model) throws Exception {		
		if(!fileName.equals(null)) {
			model.addAttribute("searchType",searchType);
			model.addAttribute("fileName",fileName);
		}
		return "admin/venue_register";
	}
	
	@RequestMapping(value = "/venue_register", method = RequestMethod.GET)
	public String venue_registerGET() throws Exception {
		return "admin/venue_register";
	}
	
	@RequestMapping(value = "/venue_register", method = RequestMethod.POST)
	public String venue_registerPOST(VenueDto venue,double latitude, double longitude,String searchType,String fileName,BoardVo vo ,Model model, RedirectAttributes rttr) throws Exception {
		venueservice.venue_create(venue);
		List<VenueDto> searchList=venueservice.venue_listSearch(vo);
		int table_id=searchList.get(0).getVenue_id();
		Venue_apiDto dtos=new Venue_apiDto(longitude,latitude,table_id);
		venue_apiservice.venue_api_create(dtos);
		if(!fileName.equals("")) {
			String table_name="venue";
			String table_crud="doc_create";
			String crud_reason="문서등록";			
			AdminDto dto=AdminDto.withoutTableContent(table_name,table_id,table_crud,crud_reason,fileName);
			adminController.file_register(dto);
			adminController.moveFile(fileName, searchType);
		}
		rttr.addFlashAttribute("msg", "success");
		return "redirect:/admin/admin_venue";
	}
	
	@RequestMapping(value = "/venue_modify", method = RequestMethod.GET)
	public String admin_venue_modifyGET(int venue_id,Model model) throws Exception {
		String table_name="venue";
		String table_crud="doc_create";
		String fileName = adminController.file_read(venue_id,table_name,table_crud);
		model.addAttribute("fileName", fileName);			
		model.addAttribute("VenueDto", venueservice.venue_read(venue_id));
		return "admin/venue_modify";
	}
	
	@RequestMapping(value = "/venue_modify", method = RequestMethod.POST)
	public String admin_venue_modifyPOST(VenueDto venue,RedirectAttributes rttr) throws Exception {
		venueservice.venue_update(venue);
		//reason,content와 고객아이디_뮤지컬아이디을 admin테이블에 저장
		rttr.addFlashAttribute("msg", "success");
		return "redirect:/admin/admin_venue";
	}
	
	@RequestMapping(value = "/venue_remove", method = RequestMethod.POST)
	@ResponseBody
	public String admin_venue_remove(int venue_id, RedirectAttributes rttr,String reason) throws Exception {		
		if(reservationservice.reservation_venuecheck(venue_id).size()==0) {
			AdminDto dto=AdminDto.withoutFileName("venue",venue_id,venueservice.venue_read(venue_id).getVenue_name(),"table_delete",reason);
			adminController.file_register(dto);
			seatservice.seat_venueAlldelete(venue_id);
			mu_schservice.musical_schedule_venuedelete(venue_id);	
			hallservice.hall_vanuedelete(venue_id);
			venue_apiservice.venue_api_delete(venue_id);	
			venueservice.venue_delete(venue_id);
			return "success";
		}else {
			return  "fail";
		}
		
	}
	
	@RequestMapping(value = "/admin_hall", method = RequestMethod.POST)
	public ResponseEntity<Map<String,Object>> HallAjax(@RequestBody Map<String, String> request,BoardVo vo) throws Exception {
		vo.setfGroupKind(request.get("venue_id"));	
		vo.setPage(Integer.parseInt(request.get("page")));
		vo.setPerPageNum(Integer.parseInt(request.get("perPageNum")));		
		Map<String,Object> map=new HashMap<>();
		List<HallDto> list= hallservice.hall_listSearch(vo);
		vo.setTotalCount(hallservice.hall_listSearchCount(vo));
		map.put("list",list);
		map.put("boardVo",vo);
		return ResponseEntity.ok(map);	
	}
	
	@RequestMapping(value = "/hall_register_file", method = RequestMethod.GET)
	public String hall_register_file(@RequestParam("searchType") String searchType,@RequestParam("fileName") String fileName,@RequestParam("table_id") int table_id,Model model) throws Exception {		
		if(!fileName.equals(null)) {
			model.addAttribute("venue_id",table_id);
			model.addAttribute("searchType",searchType);
			model.addAttribute("fileName",fileName);
		}
		return "admin/hall_register";
	}
	
	@RequestMapping(value = "/hall_register", method = RequestMethod.GET)
	public String hall_registerGET(int venue_id, Model model) throws Exception {
		model.addAttribute("venue_id",venue_id);
		return "admin/hall_register";
	}
	
	@RequestMapping(value = "/hall_register", method = RequestMethod.POST)
	public String hall_registPOST(HallDto hall,String searchType,String fileName,BoardVo vo ,Model model, RedirectAttributes rttr) throws Exception {
		hallservice.hall_create(hall);
		if(!fileName.equals("")) {
			String table_name="hall";
			String table_crud="doc_create";
			String crud_reason="문서등록";
			List<HallDto> searchList=hallservice.hall_listSearch(vo);
			int table_id=searchList.get(0).getHall_id();
			AdminDto dto=AdminDto.withoutTableContent(table_name,table_id,table_crud,crud_reason,fileName);
			adminController.file_register(dto);
			adminController.moveFile(fileName, searchType);
		}
		rttr.addFlashAttribute("msg", "success");
		return "redirect:/admin/admin_venue";
	}
	
	@RequestMapping(value = "/hall_modify", method = RequestMethod.GET)
	public String hall_modifyGET(int hall_id, Model model) throws Exception {
		String fileName = adminController.file_read(hall_id,"hall","doc_create");
		model.addAttribute("fileName", fileName);	
		model.addAttribute("hall_read",hallservice.hall_read(hall_id));
		return "admin/hall_modify";
	}
	
	@RequestMapping(value = "/hall_modify", method = RequestMethod.POST)
	public String hall_modifytPOST(HallDto hall,String searchType,String fileName,BoardVo vo ,Model model, RedirectAttributes rttr) throws Exception {
		hallservice.hall_update(hall);
		
		rttr.addFlashAttribute("msg", "success");
		return "redirect:/admin/admin_venue";
	}
	
	@RequestMapping(value = "/hall_remove", method = RequestMethod.POST)
	@ResponseBody
	public String admin_hall_remove(int hall_id, RedirectAttributes rttr,String reason) throws Exception {
		if(reservationservice.reservation_hallcheck(hall_id).size()==0) {
			AdminDto dto=AdminDto.withoutFileName("hall",hall_id,hallservice.hall_read(hall_id).getHall_name(),"table_delete",reason);
			adminController.file_register(dto);
			seatservice.seat_hallAlldelete(hall_id);
			mu_schservice.musical_schedule_halldelete(hall_id);	
			hallservice.hall_delete(hall_id);
			return "success";
		}else {
			return  "fail";
		}		
	}
	
	
}
