# AGENTS.md — TRADE LOG 프로젝트

## 프로젝트 개요
- HTML 단일 파일 웹앱 (`trading_journal.html`)
- GitHub Pages 배포: https://kami940622-cloud.github.io/TRADE-LOG/trading_journal.html
- 아이패드 최적화 (터치 친화적, 하단 탭 네비게이션)
- Terminal Pro 테마 (블랙 + 오렌지)
- IBM Plex Mono / IBM Plex Sans KR 폰트

## 기술 스택
- 순수 HTML/CSS/JS (프레임워크 없음)
- localStorage로 데이터 저장
- Binance WebSocket 실시간 가격 (실패 시 CoinGecko 폴백)
- 코인 심볼 매핑 테이블 50종 내장 (COIN_SYMBOL_MAP)

## 탭 구성
1. NEW - 거래 입력 (LONG/SHORT, 손절가, 스크린샷 첨부)
2. HISTORY - 거래 기록 (검색/정렬, 인라인 수정, WIN/DRAW/LOSE)
3. DASH - 대시보드 (스트릭, LONG/SHORT 승률, 홀딩기간, 시간대 분석, 월별)
4. WEEKLY - 주간 회고 (목표 설정, 회고 입력, BEST/WORST P&L 기준)
5. CALC - 계산기 (평단계산기 + 포지션계산기)

## CALC 탭 구성
- 평단 계산기: 독립 (calcAvg 함수)
- 포지션 계산기: 독립 (calcPos 함수)
  - 입력: 총시드, 진입가, 목표가, 손절가, 고정허용손실, 수량, 레버리지
  - 출력 순서: BEP → 포지션사이징 → 목표달성시 → 손절시
  - 핵심공식: 고정손실 ÷ (진입가 - 손절가) = 수량
- CALC → NEW TRADE 적용 버튼 (코인/LONG·SHORT/진입가/손절가/수량 자동 전달)
- NEW와 코인 목록 양방향 연동

## localStorage 데이터 구조
```
mj_trades  - 거래 목록 배열 (아래 스키마 참고)
mj_coins   - 코인 목록 배열 (예: ['BTC','ETH','XRP','SOL'])
mj_weekly  - 주간 회고 데이터 { 'YYYY-Www': { review, goalWr, goalMax } }
```

### 거래 객체 스키마
```javascript
{
  id:      'T' + Date.now(),   // 고유 ID
  coin:    'BTC',              // 코인명
  ls:      'LONG' | 'SHORT',  // 포지션
  entry:   number,             // 매수가
  amount:  number,             // 수량
  eDate:   'YYYY-MM-DDTHH:mm',// 매수일시
  sl:      number | null,      // 손절가
  slGap:   number | null,      // 손절가 괴리율 (%)
  exit:    number | null,      // 청산가
  xDate:   string  | null,     // 청산일시
  eReas:   string,             // 진입 근거
  xReas:   string,             // 청산 근거
  memo:    string,             // 비고
  market:  '상승장'|'하락장'|'박스권',
  result:  'ACTIVE'|'WIN'|'DRAW'|'LOSE',
  pnl:     number | null,      // 손익 (USDT)
  roi:     number | null,      // 수익률 (%)
  dur:     number | null,      // 홀딩 기간 (시간)
  imgs:    string[]            // base64 이미지 배열
}
```

## 코딩 원칙
- 수정 전 계획 설명 후 확인 받기
- 최소한의 코드, 중복 없이
- 수정 후 node로 로직 직접 검증 후 완료 보고
- 한 번에 너무 많은 기능 추가 금지

## 주의사항
- LONG/SHORT 포지션 항상 구분해서 계산
  - PNL: LONG = (청산가 - 진입가) × 수량 / SHORT = (진입가 - 청산가) × 수량
  - 손절 판정: LONG = 청산가 ≤ 손절가 / SHORT = 청산가 ≥ 손절가
- 기능 수정 전 반드시 기존 코드 전체 읽기
- localStorage 데이터 구조 변경 시 하위 호환성 유지

## Git / 배포
```
git add trading_journal.html
git commit -m "설명"
git push
```
push 후 GitHub Pages 자동 반영 (1-2분 소요)

## 로컬 테스트
- 파일 직접 열기: `file:///D:/Claude_Project/TRADE_LOG/trading_journal.html`
- 수정 후 반드시 Ctrl+Shift+R (강력 새로고침)

## 수정 이력
- 2026-05-18: SHORT PNL/ROI 계산 버그 수정
- 2026-05-18: SHORT 손절 판정 버그 수정 (LONG 기준만 → LONG/SHORT 분리)
- 2026-05-18: CALC 탭 LONG/SHORT 선택 추가
- 2026-05-18: CALC → NEW TRADE 적용 버튼 추가
- 2026-05-18: CALC/NEW 코인 목록 양방향 연동
- 2026-05-18: 백업(JSON 내보내기) / 복원(JSON 불러오기) 기능 추가
