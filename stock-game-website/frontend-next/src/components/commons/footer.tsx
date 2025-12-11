import React from 'react';

const Footer: React.FC = () => {
  return (
    // 'border-t'를 사용하여 헤더와 구분되는 시각적 선을 추가합니다.
    <footer className="bg-gray-800 text-white border-t border-gray-700 mt-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 1. 상단 섹션: 로고 및 주요 링크 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 border-b border-gray-700 pb-8">
          
          {/* 회사/프로젝트 정보 (로고 대체) */}
          <div className="col-span-2">
            <h3 className="text-xl font-extrabold text-indigo-400 mb-4">Stock_Company</h3>
            <p className="text-sm text-gray-400">
              주식 시뮬레이션 및 종합 정보 제공 서비스
            </p>
          </div>

          {/* 링크 그룹 1: 게임 및 랭킹 */}
          <div>
            <h4 className="text-md font-semibold mb-4">게임 & 랭킹</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/game" className="hover:text-indigo-400 transition">가상 거래소</a></li>
              <li><a href="/portfolio" className="hover:text-indigo-400 transition">나의 포트폴리오</a></li>
              <li><a href="/rankings" className="hover:text-indigo-400 transition">수익률 랭킹</a></li>
            </ul>
          </div>

          {/* 링크 그룹 2: 정보 및 학습 */}
          <div>
            <h4 className="text-md font-semibold mb-4">정보 & 교육</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/news" className="hover:text-indigo-400 transition">실시간 뉴스</a></li>
              <li><a href="/reports" className="hover:text-indigo-400 transition">기업 리포트</a></li>
              <li><a href="/academy" className="hover:text-indigo-400 transition">투자 아카데미</a></li>
            </ul>
          </div>

          {/* 링크 그룹 3: 고객 지원 */}
          <div>
            <h4 className="text-md font-semibold mb-4">고객 지원</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-indigo-400 transition">문의하기</a></li>
              <li><a href="/faq" className="hover:text-indigo-400 transition">자주 묻는 질문</a></li>
              <li><a href="/terms" className="hover:text-indigo-400 transition">이용 약관</a></li>
            </ul>
          </div>

          {/* 소셜 미디어 및 연락처 */}
          <div>
            <h4 className="text-md font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {/* 소셜 미디어 아이콘 예시 (SVG) */}
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-red-600 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.6 9.35l-7 4.14c-.3.17-.65.23-.97.04-.3-.18-.48-.49-.48-.83V8.34c0-.34.18-.65.48-.83.32-.19.67-.13.97.04l7 4.14c.3.17.4.45.4.79 0 .34-.1.62-.4.79z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.254 5.922c-.751.334-1.558.558-2.404.664.864-.518 1.528-1.33 1.837-2.302-.813.483-1.716.83-2.671 1.026-.767-.818-1.854-1.33-3.056-1.33-2.307 0-4.184 1.877-4.184 4.184 0 .328.037.645.109.95-3.475-.174-6.556-1.838-8.62-4.354-.36.619-.566 1.338-.566 2.112 0 1.45.739 2.73 1.865 3.484-.685-.022-1.326-.209-1.888-.52v.054c0 2.035 1.448 3.733 3.376 4.116-.353.097-.723.149-1.106.149-.271 0-.533-.026-.791-.076.535 1.666 2.086 2.879 3.931 2.912-1.439 1.135-3.256 1.808-5.23 1.808-.34 0-.677-.021-1.009-.06.273.744.698 1.431 1.18 2.052 1.393 1.769 3.324 2.981 5.485 3.125C9.452 20.803 11.972 21.5 14.542 21.5c4.782 0 8.802-3.829 8.802-8.543 0-.138-.003-.275-.008-.413.606-.437 1.131-.98 1.555-1.602z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* 2. 하단 섹션: 저작권 및 약관 */}
        <div className="pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Stock_Company. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end mt-4 md:mt-0 space-x-4 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-indigo-400 transition">개인정보 처리방침</a>
            <a href="/sitemap" className="hover:text-indigo-400 transition">사이트맵</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;