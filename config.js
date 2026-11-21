// 사진 src에는 https:// 주소 또는 assets/photo.jpg 같은 상대 경로를 넣으세요.
// 빈 연락처·계좌는 숨겨집니다. 성함은 기존 데모 값이므로 최종 확인해 주세요.
window.WEDDING = {
  guestbook: { backend: 'supabase', url: 'https://suxkigtqbhxnfeqxcmjd.supabase.co', publishableKey: 'sb_publishable_CJ_ipNtE9qnGcHK_JNBCKA_UjUsYIAv' },
  memorialNames: ['김성배'],
  couple: { groom: '임욱환', bride: '김다혜' },
  date: '2027-03-20', time: '13:50',
  venue: '보타닉파크웨딩', hall: '오키드홀', address: '서울 강서구 마곡중앙5로 6',
  venuePhone: '02-2662-8300',
  navigation: { kakaoJavaScriptKey: '' }, // 카카오내비 연결용. 별도 안내 후 입력.
  locationDetail: '보타닉푸르지오시티 로비층',
  map: {
    clientId: 'o84u6cg7x8', // 네이버 지도 Client ID
    latitude: 37.5673842, longitude: 126.827051, zoom: 16,
    // 예식장 공식 홈페이지에서 제공하는 목적지 링크
    naverDirections: 'https://map.naver.com/v5/directions/-/14118322.736132536,4518490.688047096,%EB%B3%B4%ED%83%80%EB%8B%89%ED%8C%8C%ED%81%AC%EC%9B%A8%EB%94%A9,94306527,PLACE_POI/-/transit',
    sketch: 'assets/venue-map.png'
  },
  transport: [
    { title: '지하철', lines: [
      { text: '9호선 마곡나루역', color: '#b39627' },
      { text: '공항철도 마곡나루역', color: '#0090d2' },
      { text: '1·2번 출구 방면 진입통로 연결', note: true },
      { text: '공항철도 이용 시 9호선 환승역 방향으로 이동해 주세요.', note: true }
    ] },
    { title: '버스', lines: [
      { text: '지선버스 : 6642, 6645, 6648', color: '#55a540' },
      { text: '마을버스 : 강서05-1, 강서07', color: '#55a540' }
    ] }
  ],
  invitation: '특별한 날보다 평범한 날에\n더 함께하고 싶은 사람을 만났습니다.\n소소한 일상을 나누며 살아갈 저희에게\n따뜻한 축복을 부탁드립니다.',
  families: [
    { parents: ['임용진', '민영순'], relation: '장남', name: '임욱환' },
    { parents: ['김성배', '구경자'], relation: '장녀', name: '김다혜' }
  ],
  introTiming: { photoMs: 5000, firstPhotoMs: 4000, gapMs: 200 },
  photos: {
    intro: [{src:'assets/intro/photo-27.jpg',x:45,y:50,zoom:1.12,fade:66},{src:'assets/intro/photo-0320.jpg',x:50,y:50,zoom:1.13,fade:45}],
    main: {src:'assets/photo-story-222.jpg',position:'50% 50%'},
    // 미리보기용 예시 20장. 실제 사진 URL 목록으로 교체하세요.
    // 예: [{src:'https://example.com/photo.jpg',alt:'함께 걷는 우리'}]
    gallery: [{"src":"assets/gallery/01.jpg?v=2","thumb":"assets/gallery/thumbs/01.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 1"},{"src":"assets/gallery/02.jpg?v=2","thumb":"assets/gallery/thumbs/02.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 2"},{"src":"assets/gallery/3.jpg?v=3","thumb":"assets/gallery/thumbs/03.jpg?v=3","alt":"다혜와 욱환의 웨딩 사진 3"},{"src":"assets/gallery/04.jpg?v=2","thumb":"assets/gallery/thumbs/04.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 4"},{"src":"assets/gallery/05.jpg?v=2","thumb":"assets/gallery/thumbs/05.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 5"},{"src":"assets/gallery/06.jpg?v=2","thumb":"assets/gallery/thumbs/06.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 6"},{"src":"assets/gallery/07.jpg?v=2","thumb":"assets/gallery/thumbs/07.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 7"},{"src":"assets/gallery/08.jpg?v=2","thumb":"assets/gallery/thumbs/08.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 8"},{"src":"assets/gallery/09.jpg?v=2","thumb":"assets/gallery/thumbs/09.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 9"},{"src":"assets/gallery/10.jpg?v=2","thumb":"assets/gallery/thumbs/10.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 10"},{"src":"assets/gallery/12.jpg?v=2","thumb":"assets/gallery/thumbs/12.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 11"},{"src":"assets/gallery/13.jpg?v=2","thumb":"assets/gallery/thumbs/13.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 12"},{"src":"assets/gallery/14.jpg?v=2","thumb":"assets/gallery/thumbs/14.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 13"},{"src":"assets/gallery/15.jpg?v=2","thumb":"assets/gallery/thumbs/15.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 14"},{"src":"assets/gallery/16.JPG?v=2","thumb":"assets/gallery/thumbs/16.jpg?v=2","alt":"다혜와 욱환의 웨딩 사진 15"},{"src":"assets/gallery/17.JPG?v=2","thumb":"assets/gallery/thumbs/17.jpg?v=2","position":"100% 50%","alt":"다혜와 욱환의 웨딩 사진 16"}],
    banner: {src:'',position:'50% 50%'}, // TODAY / FOREVER 배너
    story: {src:'',position:'50% 50%'}, // 손글씨와 함께 표시할 사진
    ending: {src:'',position:'50% 50%'} // 마지막 감사 인사 사진
  },
  contacts: [], // 예: [{group:'신랑 측',name:'신랑 임욱환',phone:'010-1234-5678'}]
  contactGroups: [
    { title: '신랑 측', side: 'groom', people: [
      { role: '신랑', name: '임욱환', phone: '010-4412-9003' },
      { role: '아버지', name: '임용진', phone: '010-5318-9003' },
      { role: '어머니', name: '민영순', phone: '010-5144-5307' }
    ] },
    { title: '신부 측', side: 'bride', people: [
      { role: '신부', name: '김다혜', phone: '010-7939-5749' },
      { role: '어머니', name: '구경자', phone: '010-5112-5749' }
    ] }
  ],
  // bank와 number를 입력하면 계좌 복사 버튼이 활성화됩니다.
  accounts: [
  {
    "group": "신랑 측",
    "role": "신랑",
    "name": "임욱환",
    "bank": "",
    "number": ""
  },
  {
    "group": "신랑 측",
    "role": "아버지",
    "name": "임용진",
    "bank": "",
    "number": ""
  },
  {
    "group": "신랑 측",
    "role": "어머니",
    "name": "민영순",
    "bank": "",
    "number": ""
  },
  {
    "group": "신부 측",
    "role": "신부",
    "name": "김다혜",
    "bank": "토스뱅크",
    "number": "1000-7222-2114"
  }
],
  share: { title:'우리, 결혼합니다', description:'2027년 3월 20일 · 보타닉파크웨딩 오키드홀', url:'https://uhdh-wedding.github.io/wedding/', image:'https://uhdh-wedding.github.io/wedding/assets/photo-story-222.jpg' }
};


