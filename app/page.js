export default function Home() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">score.dp</h1>
        <div className="text-gray-700 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">소개</h2>
            <p className="leading-relaxed">
              score.dp는 <a href="https://zasa.sakura.ne.jp/dp/" className="hover:underline" target="_blank" rel="noopener noreferrer">https://zasa.sakura.ne.jp/dp/</a>와 e-amusement의 데이터를 기반으로 서열표를 제작하는 사이트입니다.
            </p>
            <p className="text-yellow-600 mt-2">토이 프로젝트로 제작한 사이트로 사용 중 여러 오류가 발생할 수 있습니다.</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">사용법</h2>
            <ol className="space-y-3 text-sm">
              <li>
                <span className="font-medium">베이직 코스 가입</span>
                <div className="ml-4 mt-1">
                  데이터 갱신을 위해 베이직 코스 가입이 필요합니다.<br/>
                  <a href="https://p.eagate.573.jp/payment/p/select_course.html?course=eaBASIC" className="hover:underline" target="_blank" rel="noopener noreferrer">
                    https://p.eagate.573.jp/payment/p/select_course.html?course=eaBASIC
                  </a>
                </div>
              </li>
              <li>
                <span className="font-medium">투덱 홈페이지 접속</span>
                <div className="ml-4 mt-1">
                  <a href="https://p.eagate.573.jp/game/2dx/32/index.html" className="hover:underline" target="_blank" rel="noopener noreferrer">
                    https://p.eagate.573.jp/game/2dx/32/index.html
                  </a>
                </div>
              </li>
              <li>
                <span className="font-medium">코드 입력</span>
                <div className="ml-4 mt-1">
                  F12를 눌러 콘솔에 아래 코드를 입력합니다.<br/>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    javascript:$.getScript("https://scoredp.duckdns.org/iidx.js");
                  </code>
                </div>
              </li>
              <li>
                <span className="font-medium">데이터 전송</span>
                <div className="ml-4 mt-1">
                  시작을 눌러 데이터를 서버에 전송합니다.<br/>
                  <span className="text-red-600">전송에는 오랜 시간이 걸릴 수 있기에, 창을 닫지 말고 대기해주세요.</span>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">문의</h2>
            <p className="leading-relaxed">
              관련 문의는 <a href="https://x.com/catchgator__" className="hover:underline" target="_blank" rel="noopener noreferrer">🐊 @catchgator__</a> 로 부탁드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
