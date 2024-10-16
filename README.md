Spring 레거시로 구현한 뮤지컬 예매 사이트 입니다.

개발환경 : Spring Framework 3.0, jdk8.0, Tomcat, JSP, Oracle21, React
  라이브러리 : MyBatis, Ajax, pdfbox, apache.poi, twelvemonkeys.imageio, select2, 카카오맵 API
담당역할 : 고객센터(이용안내, FAQ, 공지사항), 관리자 페이지 기능 구현

![image](https://github.com/user-attachments/assets/77efbb5e-4f7a-4743-8c18-8cfd54995ae5)

![image](https://github.com/user-attachments/assets/6050bdec-b8f4-4d64-aefe-2b606def76e1)
검색 기능과 함께 페이징 처리를 하였으며, Model을 통해 뷰로 전달된 데이터를 화면에 렌더링 
- FAQ,공지사항 게시판은 JSP뿐만 아니라 react로 추가 구현
- FAQ 게시글의 추가,수정,삭제는 Ajax 요청을 사용하여 서버와 비동기 통신하여 데이터를 처리



