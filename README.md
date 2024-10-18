Spring 레거시로 구현한 뮤지컬 예매 사이트 입니다.

개발환경 : Spring Framework 3.0, jdk8.0, Tomcat, JSP, Oracle21, React <br>
  라이브러리 : MyBatis, Ajax, pdfbox, apache.poi, twelvemonkeys.imageio, select2, 카카오맵 API <br>
담당역할 : 고객센터(이용안내, FAQ, 공지사항), 관리자 페이지 기능 구현 <br>

![image](https://github.com/user-attachments/assets/77efbb5e-4f7a-4743-8c18-8cfd54995ae5) ![image](https://github.com/user-attachments/assets/6050bdec-b8f4-4d64-aefe-2b606def76e1)

검색 기능과 함께 페이징 처리를 하였으며, Model을 통해 뷰로 전달된 데이터를 화면에 렌더링 
- FAQ,공지사항 게시판은 JSP뿐만 아니라 react로 추가 구현
- FAQ 게시글의 추가,수정,삭제는 Ajax 요청을 사용하여 서버와 비동기 통신하여 데이터를 처리
 <br> <br>

![image](https://github.com/user-attachments/assets/46d7f0cd-a851-42bc-a586-397224b7958e) ![image](https://github.com/user-attachments/assets/992c362b-dc4c-490d-86de-bb6f7d0e3847)

문서함은 사용자들이 팩스로 수신된 문서 파일을 관리하고 조회할 수 있는 기능을 제공, 팩스 폴더에서 스캔된 문서 목록을 읽어와 화면에 출력
- 사용자들은 스캔된 문서를 미리보기로 확인하여 특정 정보(뮤지컬, 극장, 배우 등)에 연결, 등록하고 사용자들은 연결된 문서를 참고하여 테이블 등록, 수정 등 작업
- 연결된 문서는 등록 문서함으로 이동, 전자문서화 되어 관리
- TIFF 파일을 PDF로 변환하기 위해 ImageIO를 사용하여 TIFF 파일을 읽고 이미지 정보를 추출한 후, 이를 Apache PDFBox의 PDDocument 및 PDPage와 결합하여 PDF 파일을 생성

엑셀 다운로드 버튼을 클릭하면, 선택된 조건에 맞는 데이터를 서버에서 조회한 후 엑셀 파일로 자동 생성하여 사용자에게 제공
- 엑셀 파일은 Apache POI라이브러리의 XSSFWorkbook을 사용하여 엑셀 파일 생성 로직을 구현, 데이터베이스를 조회하여 엑셀의 행과 열로 매핑, 엑셀 파일이 생성되며, 뮤지컬 제목, 공연 기간, 러닝 타임, 제한 연령 등의 데이터를 포함
- 프론트엔드에서 사용자가 입력한 검색 조건(공연 기간, 검색어 등)을 서버로 전달하고, 이에 맞는 데이터를 조회해 엑셀 파일을 생성할 수 있도록 구현
- 엑셀 파일 다운로드 시, 전체 페이지 새로고침 없이 검색 조건에 맞는 데이터를 즉시 다운로드 받을 수 있도록 jQuery Ajax 요청을 통해 비동기 처리를 적용
- 이 기능은 사용자가 대규모 데이터 세트를 직관적으로 조회하고, 보고서나 데이터 분석 목적으로 활용할 수 있도록 설계됨

 <br> <br>
![image](https://github.com/user-attachments/assets/643c619d-b957-47d4-af5f-f395f0396c1e)

극장추가, 수정 작업 시 극장명을 입력하고 카카오 지도 API를 통해 해당 장소의 주소 및 위치 정보를 검색
- 장소 검색 시, 입력된 극장명에 따라 관련된 장소 목록이 팝업창에 표시되며, 사용자는 검색된 장소 목록 중에서 하나를 선택
-선택한 장소의 주소, 경도, 위도 정보는 폼에 자동으로 채워지고, 이 정보는 극장 등록 시 데이터베이스에 저장






