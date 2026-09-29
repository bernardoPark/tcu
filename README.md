# THE CLUB UNDERCRAFT — 홈 랜딩 페이지

Figma `혁신 / 홈 랜딩 페이지` (node `2955-112`, 1440 × 7578) 를 그대로 옮긴 반응형 정적 사이트입니다.
빌드 도구 없이 HTML + CSS + 바닐라 JS 로만 동작합니다.

## 실행

```bash
node server.js
```

`http://localhost:5173` 에서 열립니다. (또는 아무 정적 서버나 사용하면 됩니다.)

## 구조

```
index.html            홈 랜딩 페이지 전체
css/reset.css         Piccalilli "A more modern CSS reset" + box-sizing / .flow
css/tokens.css        Utopia 유동 타입·스페이스 스케일, 컬러, 폰트 스택
css/layout.css        Every Layout 프리미티브 (stack, box, center, cluster,
                      sidebar, switcher, cover, grid, frame, reel)
css/style.css         컴포넌트 + 데스크톱 콜라주 배치
js/main.js            헤더 상태, 모바일 내비, 스크롤 리빌, 히어로 패럴랙스
assets/img/           Figma 에서 추출한 원본 이미지 + grain 타일
assets/fonts/         Helvetica Neue LT Pro 웹폰트를 넣는 자리 (아래 참고)
server.js             로컬 미리보기용 초경량 정적 서버
```

## 타이포그래피

| 용도 | 서체 | 비고 |
|---|---|---|
| 컨덴스드 디스플레이 | **Antonio** | Google Fonts 에서 로드 |
| 본문 (한글) | **Pretendard Variable** | jsDelivr CDN |
| 본문 (영문) | **Helvetica Neue LT Pro** | 라이선스 폰트 — 저장소에 포함하지 않음 |

Helvetica Neue LT Pro 는 유료 서체라 파일을 넣지 않았습니다. 라이선스가 있으면
아래 이름으로 `assets/fonts/` 에 넣기만 하면 `@font-face` 가 바로 잡습니다.

```
assets/fonts/HelveticaNeueLTPro-Roman.woff2   (400)
assets/fonts/HelveticaNeueLTPro-Md.woff2      (500)
assets/fonts/HelveticaNeueLTPro-Bd.woff2      (700)
```

넣기 전까지는 `Helvetica Neue → Pretendard → Helvetica → Arial` 로 폴백합니다.

## 스케일

[Utopia](https://utopia.fyi) 방식으로 생성했습니다. 뷰포트 320 → 1240 구간에서 선형 보간.

- **타입** 16px / 1.2 → **24px** / 1.25 (본문 24pt 지정 반영). `--step--2` ~ `--step-5`
- **스페이스** 16px → 20px, 배수 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 + `s-l` 페어
- 포스터급 대문자는 스케일 밖에서 `--display-xl / l / m` 으로 따로 잡았습니다.

## 반응형 전략

디자인이 1440 아트보드 위에 회전·중첩된 콜라주라, 폭에 따라 세 가지로 나눕니다.

| 폭 | 레이아웃 |
|---|---|
| ~ 767px | 단일 컬럼 플로우, 햄버거 내비 |
| 768 ~ 1099px | 2컬럼 그리드 플로우 |
| 1100px ~ | **Figma 콜라주 1:1 재현** |

데스크톱 콜라주는 1440 기준 좌표를 **퍼센트**로, 글자 크기를 **컨테이너 쿼리 단위(`cqw`)** 로
잡아서, 1100px 부터 초대형 화면까지 구성이 통째로 비례 확대·축소됩니다.
작은 캡션류에는 `max()` 로 가독성 하한을 걸어 두었습니다.

## 이미지

Figma 파일에 올라간 원본을 그대로 내려받아 `assets/img/` 에 넣었습니다.
다만 로그인 없이 열람 가능한 뷰어에서 받은 것이라 **최대 480px 급 프리뷰 해상도**입니다.
전체 화면 이미지(히어로, 풀블리드 컷)는 원본 해상도로 교체하는 편이 좋습니다 —
파일명만 유지하면 코드 수정 없이 바뀝니다.

사진은 CSS 로 `grayscale + contrast` 를 먹여 원안의 고대비 흑백 톤을 맞췄고,
전면에 128px 노이즈 타일(`assets/img/grain.png`)을 깔아 인쇄물 질감을 냈습니다.

## 접근성 / 성능

- 시맨틱 랜드마크, skip link, `:focus-visible` 아웃라인, `visually-hidden` 제목
- `prefers-reduced-motion` 존중 (리빌·패럴랙스·마퀴 정지)
- JS 는 전부 점진적 향상 — 꺼져 있어도 페이지는 완전히 동작합니다
- 이미지 `loading="lazy"` (히어로만 `fetchpriority="high"`), 명시적 `width`/`height`

## 남은 것

- Figma 의 나머지 프레임(온보딩 / JOIN 4종)은 아직 구현하지 않았습니다.
- 푸터 링크와 `JOIN` 버튼은 아직 자리표시자(`#`)입니다.
