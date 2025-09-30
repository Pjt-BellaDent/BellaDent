# SmileOn 프로젝트 이미지 가이드

이 디렉토리에는 README.md에서 사용할 프로젝트 구현 이미지들을 저장합니다.

## 이미지 파일들

### 주요 기능 구현 스크린샷
1. **ai-chatbot-demo.JPG** - AI 챗봇 상담 화면
   - AI 챗봇과의 실시간 대화 모습
   - 예약 안내 및 FAQ 응답 화면

2. **CRM 대시보드 화면** (복수 이미지)
   - **crm-dashboard_1.JPG** - 현장 접수 화면 (당일 방문 환자 등록)
   - **crm-dashboard_2.JPG** - 환자 목록 관리 테이블
   - **crm-dashboard_3.JPG** - 예약 관리 및 일정 조회
   - **crm-dashboard_4.JPG** - 진료 대기 현황 모니터링

3. **sms-system.JPG** - SMS 발송 시스템 화면
   - SMS 발송 관리 인터페이스
   - 발송 이력 및 상태 확인
   - 템플릿 관리 화면

4. **realtime-chat.JPG** - 실시간 채팅 화면
   - 환자-상담사 간 채팅 UI
   - 실시간 알림 및 상태 표시
   - 채팅 이력 관리

5. **auth-system.JPG** - 로그인 및 권한 관리 시스템
   - 사용자 역할별 로그인 화면
   - 권한에 따른 메뉴 및 기능 접근 제어
   - 환자용/직원용 인터페이스 구분

6. **환자 예약 시스템** (복수 이미지)
   - **patient-booking_1.JPG** - 날짜 및 시간 선택 캘린더
   - **patient-booking_2.JPG** - 예약 내용 입력 모달창 및 완료

### 전체 시스템 결과
7. **patient-homepage.JPG** - 환자용 홈페이지
   - 메인 페이지 및 예약 화면
   - AI 챗봇 상담 인터페이스
   - 전체적인 UI/UX 디자인

8. **crm-system.JPG** - 관리자용 CRM 시스템
   - 환자 관리 및 대시보드 전체 화면
   - 예약 관리 및 SMS 발송 기능
   - 시스템 설정 및 관리 메뉴

9. **architecture-implementation.jpg** - 실제 구현된 아키텍처
   - 실제 개발된 시스템 구조도
   - 데이터 플로우 및 API 연동 상태
   - 기술 스택 간 연결 관계

## 이미지 사용 가이드

### 기본 사용법
- 모든 이미지는 이 `/images` 디렉토리에 저장
- README.md에서 이미지 경로는 `images/파일명.JPG` 형식으로 참조
- 이미지 추가 후 README.md의 이미지 링크가 올바르게 작동하는지 확인

### 복수 이미지 처리 방법

#### 1. 연속 이미지 (같은 기능의 여러 화면)
하나의 기능에 여러 화면이 있는 경우, 파일명에 번호를 추가:
```
crm-dashboard_1.JPG  (현장 접수 화면)
crm-dashboard_2.JPG  (환자 목록 화면)  
crm-dashboard_3.JPG  (예약 관리 화면)
crm-dashboard_4.JPG  (진료 대기 화면)
```

#### 2. 단계별 프로세스 이미지
단계별 프로세스를 보여주는 경우:
```
patient-booking_1.JPG  (날짜 선택)
patient-booking_2.JPG  (내용 입력 및 완료)
```

#### 3. README.md에서 복수 이미지 사용 예시
```markdown
**CRM 대시보드 구현 화면들**:

![현장 접수 화면](images/crm-dashboard_1.JPG)
*현장 방문 환자 등록 및 접수 처리*

![환자 목록 관리](images/crm-dashboard_2.JPG)
*환자 정보 조회 및 관리 테이블*

![예약 관리 시스템](images/crm-dashboard_3.JPG)
*예약 일정 조회 및 관리*

![진료 대기 현황](images/crm-dashboard_4.JPG)
*실시간 대기 현황 모니터링*